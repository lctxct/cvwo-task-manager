# CVWO Task Manager 

## Installation 

### Prerequisites

1. go
2. mysql 
3. npm 

### Clone 
```
git clone https://github.com/lctxct/cvwo-task-manager.git
```

### Running
1. Prepare `.env` file 
```
cd backend 
cp .env.sample .env
```
Modify `.env` file to reflect the correct credentials 

2. In the same folder, build and run 
```
make
```

3. Start client 

* Navigate into `client/` folder 
* Install dependencies (only need to run this once)

```
npm install 
```
* Run app
```
npm start 
```

Open http://localhost:3000 to view in browser. 

### This mostly-working project was completed (or incompleted) by **Lien Cai Ting, A0237771X**.