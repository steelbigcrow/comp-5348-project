## Overview

This repository contains multiple Spring Boot applications built with Gradle, each serving a different purpose:

- **Store Application**: Port 8080
- **Bank Application**: Port 8081
- **Delivery Application**: Port 8082
- **Email Application**: Port 8083
- **Frontend Application** : Port 3000

# Prerequisites

Before you can run this project, make sure you have the following installed:

1. **Java 8**
   - Ensure that you have Java 8 installed on your machine. You can check your Java version by running the following command in your terminal:

     ```bash
     java -version
     ```

   - If Java 8 is not installed, you can download it from the [Oracle website](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html) or use a package manager.

2. **Gradle**
   - You need to have Gradle installed to build and run the project. You can check if Gradle is installed by running:

     ```bash
     gradle -v
     ```

   - If Gradle is not installed, you can follow the instructions on the [Gradle installation page](https://gradle.org/install/).

3. **NodeJs**
 Node.js is needed to bed installed (you can download it from [nodejs.org](https://nodejs.org/)

## Getting Started

### Clone the Repository

```bash
git clone https://github.sydney.edu.au/thei0438/comp-5348-project.git
cd comp-5348-project

```

# PostgreSQL Setup

### This setup need for Store,Email,Delivery & Bank Applications
#### In the resources/application.properties
```bash
spring.datasource.url=jdbc:postgresql://localhost:5432/<your-database-name>
spring.datasource.username=<username>
spring.datasource.password=<password>
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

# **Preloaded Data**
To facilitate testing, the applications come with preloaded data. You can find the SQL files in the ```root directory``` of each application. These SQL files will create necessary tables and insert initial data when the application starts.


# **Frontend App Setup**
   - After ensuring that both Java and Gradle are installed, navigate to the frontend project directory in your terminal and run the following commands to install the necessary packages and execute the project:

     ```bash
     cd store-app-frontend
     npm install
     npm start
     ```

# **Testing Credentials**
To test the applications, you can use the following credentials:

```bash
Username: customer
Password: COMP5348
```
