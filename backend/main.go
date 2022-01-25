package main

import (
	"fmt"
	"strconv"

	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var db *sql.DB

type Tag struct {
	ID      int64  `json:"id"`
	Content string `json:"content"`
}

type Task struct {
	ID          int64  `json:"id"`
	Date        string `json:"date"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Tags        []Tag  `json:"tags"`
}

type TaskTag struct {
	Task_ID int64 `json:"task_id"`
	Tag_ID  int64 `json:"tag_id"`
}

func (task *Task) AddTag(tag Tag) []Tag {
	task.Tags = append(task.Tags, tag)
	return task.Tags
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Capture connection properties
	cfg := mysql.Config{
		User:                 os.Getenv("DBUSER"),
		Passwd:               os.Getenv("DBPASS"),
		Net:                  "tcp",
		Addr:                 os.Getenv("DBADDR"),
		AllowNativePasswords: true,
	}
	// Get a database handle
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec("CREATE DATABASE IF NOT EXISTS taskManager")
	if err != nil {
		log.Fatal(err)
	}
	db.Close()

	cfg = mysql.Config{
		User:                 os.Getenv("DBUSER"),
		Passwd:               os.Getenv("DBPASS"),
		Net:                  "tcp",
		Addr:                 os.Getenv("DBADDR"),
		DBName:               "taskManager",
		AllowNativePasswords: true,
	}

	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal(err)
	}

	pingErr := db.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}
	fmt.Println("Connected to DB!")

	err = createTables()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Tables created!")

	// gin routers
	router := gin.New()
	router.Use(CORSMiddleware())

	router.GET("/tasks", getTasks)
	router.GET("/task/:id", getTaskByID)
	router.GET("/tags", getTags)
	router.GET("/tags/:id", getTagsByTaskID)

	router.POST("/task", postTask)
	//router.POST("/task/:id", updateTask) // id preserved
	router.POST("/tag", postTag)
	router.POST("/update/task/:id", postModifyTask)
	router.POST("/tasktag", postTaskTag)

	router.DELETE("/task/:id", deleteTask)
	router.DELETE("/remove/:id1/:id2", deleteTaskTag)

	router.Run("localhost:8080")
}

func createTables() error {
	_, err := db.Exec("CREATE TABLE IF NOT EXISTS tasks (id INT AUTO_INCREMENT NOT NULL, date VARCHAR(128) NOT NULL,title VARCHAR(255) NOT NULL,description VARCHAR(500) NOT NULL,PRIMARY KEY (`id`))")
	if err != nil {
		return err
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS tags (id INT AUTO_INCREMENT NOT NULL, content VARCHAR(255) NOT NULL, PRIMARY KEY (`id`))")
	if err != nil {
		return err
	}

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS taskTag (task_id INT NOT NULL, tag_id INT NOT NULL, FOREIGN KEY (`task_id`) REFERENCES tasks(id), FOREIGN KEY (`tag_id`) REFERENCES tags(id))")
	if err != nil {
		return err
	}

	return nil
}

/** RETRIEVING DATA **/
// Querying for task with the specified ID
func taskById(id int64) (Task, error) {
	var t Task

	row := db.QueryRow("SELECT * FROM tasks WHERE id = ?", id)
	if err := row.Scan(&t.ID, &t.Date, &t.Title, &t.Description); err != nil {
		if err == sql.ErrNoRows {
			return t, fmt.Errorf("taskById %d: no such task", id)
		}
		return t, fmt.Errorf("taskById %d: %v", id, err)
	}

	rows, err := db.Query("SELECT tags.id, tags.content FROM tags INNER JOIN taskTag WHERE taskTag.task_id = ? && taskTag.tag_id = tags.id", id)
	if err != nil {
		return t, fmt.Errorf("taskById %d: %v", id, err)
	}
	for rows.Next() {
		var s Tag
		if err := rows.Scan(&s.ID, &s.Content); err != nil {
			return t, fmt.Errorf("taskById: %v", err)
		}
		t.AddTag(s)
	}
	if err := rows.Err(); err != nil {
		return t, fmt.Errorf("taskById: %v", err)
	}
	return t, nil
}

func tagsByTaskID(id int64) ([]Tag, error) {
	var tags []Tag

	rows, err := db.Query("SELECT tags.id, tags.content FROM tags INNER JOIN taskTag WHERE taskTag.task_id != ?", id)
	if err != nil {
		return nil, fmt.Errorf("tagsByTaskID: %v", err)
	}

	for rows.Next() {
		var t Tag
		if err := rows.Scan(&t.ID, &t.Content); err != nil {
			return nil, fmt.Errorf("tagsByTaskID: %v", err)
		}
		tags = append(tags, t)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("tagsByTaskID: %v", err)
	}

	return tags, nil
}

// Querying for all tasks
func allTasks() ([]Task, error) {
	var tasks []Task

	rows, err := db.Query("SELECT * FROM tasks")
	if err != nil {
		return nil, fmt.Errorf("allTasks: %v", err)
	}

	// Iterating through tasks
	for rows.Next() {
		var t Task
		if err := rows.Scan(&t.ID, &t.Date, &t.Title, &t.Description); err != nil {
			return nil, fmt.Errorf("allTasks: %v", err)
		}
		id := t.ID

		// Iterating through tags for each task
		tagrows, err := db.Query("SELECT tags.id, tags.content FROM tags INNER JOIN taskTag WHERE taskTag.task_id = ? && taskTag.tag_id = tags.id", id)
		if err != nil {
			return nil, fmt.Errorf("allTasks: %v", err)
		}
		for tagrows.Next() {
			var s Tag
			if err := tagrows.Scan(&s.ID, &s.Content); err != nil {
				return nil, fmt.Errorf("allTasks: %v", err)
			}
			t.AddTag(s)
		}

		tasks = append(tasks, t)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("allTasks: %v", err)
	}

	return tasks, nil
}

func allTags() ([]Tag, error) {
	var tags []Tag

	rows, err := db.Query("SELECT * FROM tags")
	if err != nil {
		return nil, fmt.Errorf("allTags: %v", err)
	}

	for rows.Next() {
		var t Tag
		if err := rows.Scan(&t.ID, &t.Content); err != nil {
			return nil, fmt.Errorf("allTags: %v", err)
		}
		tags = append(tags, t)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("allTags: %v", err)
	}

	return tags, nil
}

/** ADDING DATA **/
func addTask(t Task) (int64, error) {
	result, err := db.Exec("INSERT INTO tasks (date, title, description) VALUES (?, ?, ?)", t.Date, t.Title, t.Description)
	if err != nil {
		return 0, fmt.Errorf("addTask: %v", err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("addTask: %v", err)
	}
	return id, nil
}

func addTag(t Tag, task_id int64) (int64, error) {
	result, err := db.Exec("INSERT INTO tags (content) VALUES (?)", t.Content)
	if err != nil {
		return 0, fmt.Errorf("addTag: %v", err)
	}

	tag_id, err := result.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("addTag: %v", err)
	}

	// Insert into intermediary list
	_, err = db.Exec("INSERT INTO taskTag (task_id, tag_id) VALUES (?, ?)", task_id, tag_id)
	if err != nil {
		return 0, fmt.Errorf("addTag: %v", err)
	}
	return tag_id, nil
}

func addTaskTag(t TaskTag) error {
	_, err := db.Exec("INSERT INTO taskTag (task_id, tag_id) VALUES (?, ?)", t.Task_ID, t.Tag_ID)
	if err != nil {
		return fmt.Errorf("addTaskTag: %v", err)
	}
	return nil
}

/** CHANGING DATA **/
func modifyTask(t Task) (int64, error) {
	_, err := db.Exec("UPDATE tasks SET date = ?, title = ?, description = ? WHERE id = ?", t.Date, t.Title, t.Description, t.ID)
	if err != nil {
		return 0, fmt.Errorf("modifyTask: %v", err)
	}
	return t.ID, nil
}

/** REMOVING DATA **/
func removeTask(id int64) error {
	_, err := db.Exec("DELETE FROM taskTag WHERE task_id = ?", id)
	if err != nil {
		return fmt.Errorf("removeTask: %v", err)
	}

	_, err = db.Exec("DELETE FROM tasks WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("removeTask: %v", err)
	}

	return nil
}

func removeTaskTag(id1 int64, id2 int64) error {
	_, err := db.Exec("DELETE FROM taskTag WHERE task_id = ? && tag_id = ?", id1, id2)
	if err != nil {
		return fmt.Errorf("removeTaskTag: %v", err)
	}

	return nil
}

/** METHODS **/
// [GET]
func getTasks(c *gin.Context) {
	tasks, err := allTasks()
	if err != nil {
		log.Fatal(err)
	}

	c.IndentedJSON(http.StatusOK, tasks)
}

func getTaskByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		log.Fatal(err)
		return
	}

	task, err := taskById(id)
	if err != nil {
		log.Fatal(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "task not found"})
		return
	}
	c.IndentedJSON(http.StatusOK, task)
}

func getTags(c *gin.Context) {
	tags, err := allTags()
	if err != nil {
		log.Fatal(err)
	}

	c.IndentedJSON(http.StatusOK, tags)
}

func getTagsByTaskID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		log.Fatal(err)
		return
	}

	tags, err := tagsByTaskID(id)
	if err != nil {
		log.Fatal(err)
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "tags not found"})
		return
	}
	c.IndentedJSON(http.StatusOK, tags)
}

// [POST]
func postTask(c *gin.Context) {
	var t Task

	// Call BindJSON to bind the received JSON to t
	if err := c.BindJSON(&t); err != nil {
		return
	}

	// Add the new task to the slice
	id, err := addTask(t)
	if err != nil {
		log.Fatal(err)
	}
	t.ID = id
	c.IndentedJSON(http.StatusCreated, t)
}

func postTag(c *gin.Context) {
	var t Tag

	if err := c.BindJSON(&t); err != nil {
		return
	}

	// abused ID field here to contain task ID
	_, err := addTag(t, t.ID)
	if err != nil {
		log.Fatal(err)
	}
	c.IndentedJSON(http.StatusCreated, t)
}

func postTaskTag(c *gin.Context) {
	var t TaskTag

	if err := c.BindJSON(&t); err != nil {
		return
	}

	err := addTaskTag(t)
	if err != nil {
		log.Fatal(err)
	}
	c.IndentedJSON(http.StatusCreated, t)
}

func postModifyTask(c *gin.Context) {
	var t Task

	if err := c.BindJSON(&t); err != nil {
		return
	}

	_, err := modifyTask(t)
	if err != nil {
		log.Fatal(err)
	}
	c.IndentedJSON(http.StatusCreated, t)
}

// [PUTS]

// [DELETE]
func deleteTask(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		log.Fatal(err)
		return
	}

	err = removeTask(id)
	if err != nil {
		log.Fatal(err)
	}
}

func deleteTaskTag(c *gin.Context) {
	id1, err := strconv.ParseInt(c.Param("id1"), 10, 64)
	if err != nil {
		log.Fatal(err)
		return
	}

	id2, err := strconv.ParseInt(c.Param("id2"), 10, 64)
	if err != nil {
		log.Fatal(err)
		return
	}

	err = removeTaskTag(id1, id2)
	if err != nil {
		log.Fatal(err)
	}
}

// sourced from stack overflow https://stackoverflow.com/questions/29418478/go-gin-framework-cors
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
