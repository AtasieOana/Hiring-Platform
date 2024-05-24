# Hiring-Platform

### Application name: *Joblistic*

### Application motivation
The application will be aimed for students and recent graduates. In order to simplify their job search process, job listings will be limited to those targeting entry-level experience. Additionally, since these may be some of their first experiences in the job market, the hiring system will be more transparent. Posting a job within the application will require the employer to describe all the recruitment steps, allowing both the employer and the applicant to track this process.

### Repository content
This repository contains the code developed for the application. It is structured in 4 subfolders: backend, frontend, docker (used for integration with Redis) and database.

The backend is sectioned into 5 microservices, each of them containing:
- methods for the authentication system
- methods for candidates
- methods for employers
- methods for administrators
- common methods

### Tehnologies
- Database with Oracle
- Backend with Java with Spring Boot
- Frontend with React
  
### Running the app
```
sudo service docker start
Go to HiringPlatformDockerConfig directory
docker compose -f docker-compose.yml up

If it's the case
sudo kill -9 `sudo lsof -t -i:8080`
```

Also run each microservice `mvn spring-boot:run` and the frontend with `npm start`.
