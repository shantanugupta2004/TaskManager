# **Task Manager App**

A full-stack task management application with a **React frontend**, **Node.js backend**, and **PostgreSQL database**.  

## **Getting Started**

### **Prerequisites**
Ensure you have the following installed on your system:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## **Setup & Run the Application**
Follow these steps to set up and run the project locally:

### **Clone the Repository**
```sh
git clone https://github.com/shantanugupta2004/TaskManager.git
cd TaskManager
```

### **Create an Environment File (`.env`)**
Navigate to the **backend** folder and create a `.env` file:
```sh
cd backend
touch .env
```
Then, add the following environment variables inside `.env`:
```
PORT=5000
DOCKER_DATABASE_URL=postgres://postgres:postgres@db:5432/task_manager
JWT_SECRET=your_secret_key_here
```


Go back to the project root:
```sh
cd ..
```

---

### **Run the Application Using Docker**
Now, run the following command to build and start all services:
```sh
docker-compose up --build
```
This will:
- **Build and start the backend**
- **Build and start the frontend**
- **Start a PostgreSQL database container**

---

### **Restore the Database (if needed)**
If you need to restore the database backup, run:
```sh
docker ps  # Find the PostgreSQL container ID
docker exec -i <container_id> psql -U postgres -d task_manager < backend/database_backup/task_db_backup.sql
```
*(Replace `<container_id>` with the actual PostgreSQL container ID.)*

---

## **Access the Application**
- **Frontend:** Open [http://localhost:4173](http://localhost:4173)
- **Backend API:** Open [http://localhost:5000](http://localhost:5000)
- **PostgreSQL Database:** Connect using:
  ```
  Host: localhost
  Port: 5432
  User: postgres
  Password: postgres
  Database: task_manager
  ```

---

## **Stopping & Cleaning Up**
To stop the containers without removing data:
```sh
docker-compose down
```
To stop and **remove all containers & database data**:
```sh
docker-compose down -v
```

---

## **Development Without Docker**
If you want to run the backend and frontend manually:

### **Backend**
```sh
cd backend
npm install
npm run dev
```

### **Frontend**
```sh
cd frontend
npm install
npm run dev
```

---


