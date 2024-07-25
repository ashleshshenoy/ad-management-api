
# Platform for advertisers

Backend system that handles user authentication & advertisement managment.

### Highlights 

    - JWT based authentication & role based authorisation
    - File & meta data handling
    - advertisement attribute management
    - well documented API using swagger
    - designed (not implemented) a highly scalable system
    - video files are compressed using FFMPEG
    - optionally images can be compressed 
    - containerized application using docker for quick setup

### High level overview
    
    => The express sever handles all the requests and manipulates the models 
![HLD drawio](https://github.com/user-attachments/assets/d0b021c6-bfcd-4bf8-a2f5-ad32b01d15a8)
![model drawio](https://github.com/user-attachments/assets/0b0890ab-d7b6-4d04-8e48-9793700a5f14)

    => This simple implimentation however has 2 major performance bottle neck 
        1. The local storage is hard to manage and scale
        2. The compression of videos is a CPU intensive process, and can add significant delay and response time.
    
    => We can overcome this with the help of S3 for storing the files.
    => The CPU intensive compression process is now handled by background workers (EC2). 
    => The main server can load off its tasks to a queue, which are then executed by the background worker.
    => Head over to [github repo](https://github.com/ashleshshenoy/dash-streaming-application) 
        where I've implemented similar system.
    => Here is a HLD of the mentioned solution
![scale drawio](https://github.com/user-attachments/assets/1f917f57-e623-45a9-8e0b-16aa6a5fee09)



### Quick setup with docker 

Clone the project

```bash
  git clone https://github.com/ashleshshenoy/ad-management-api.git api
```

Go to the project directory

```bash
  cd api
```

Run using docker compose 

```bash
  docker compose up --build
```

** if no error headover to https://localhost:5000/api-docs


