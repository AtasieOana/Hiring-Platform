# Hiring-Platform

### Application name: *Joblistic*

### Running the app

```
sudo service docker start
HiringPlatformDockerConfig/
cd Database
docker build -t joblistic_db:latest -f Dockerfile .
cd ../../HiringPlatformBackend/AuthenticationService/
docker build -t authentication_service:latest -f Dockerfile .
cd ../../HiringPlatformBackend/EmployerService/
docker build -t employer_service:latest -f Dockerfile .
cd ../../HiringPlatformBackend/CandidateService/
docker build -t candidate_service:latest -f Dockerfile .
cd ../../HiringPlatformBackend/CommonService/
docker build -t common_service:latest -f Dockerfile .
cd ../../HiringPlatformBackend/AdminService/
docker build -t admin_service:latest -f Dockerfile .
cd ../../HiringPlatformFrontend/
docker build -t platform_frontend:latest -f Dockerfile .
cd ../HiringPlatformDockerConfig/
docker compose -f docker-compose.yml up

sudo kill -9 `sudo lsof -t -i:8080`
```

```
docker exec -it joblistic_db sqlplus / as sysdba
SQL> alter session set "_ORACLE_SCRIPT"=true;

Session altered.

SQL> CREATE USER disertatie IDENTIFIED BY oracle;

User created.

SQL> GRANT ALL PRIVILEGES TO disertatie;
 docker exec -it joblistic_db bash -c "source /home/oracle/.bashrc; sqlplus /nolog"
connect sys/oracle@ORCLDB as sysdba;
SQL> grant all privileges to disertatie;

Grant succeeded.

SQL> grant all privileges to sys;

Grant succeeded.
docker exec -it joblistic_db sqlplus  disertatie/oracle
```

### Models app: 
* https://www.hirist.com/
* https://www.jobly.fi/en

### Colors:
The **60-30-10** rule is used:
* primary color (occupies 60% of the page): white
* secondary color (occupies 30% of the page): beige (#e09c73)
* accent color (occupies 10% of the page): green (#698576)

Color ideas:
* https://colors.muz.li/color/f9cbc1
* https://colors.muz.li/color/fff0db
* https://colors.muz.li/color/fbc094
