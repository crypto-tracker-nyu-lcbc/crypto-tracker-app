<<<<<<< HEAD
# crypto-tracker-app

## Setting up docker:
Install docker desktop from https://docs.docker.com/desktop/install/windows-install/ for windows or https://docs.docker.com/desktop/install/mac-install/ for mac.

## Starting the container for database and accessing the database cli:
Clone this repository to your working directory and from that directory run these commands to(make sure to run these commands from the directory where the Makefile is present):

Start the database container:
  ```make up```

Access the database cli:
  ```make cli```

You can create (or) open an existing database using the below command in sqlite cli:
  ```.open sample.db```

I have also provided a sample.sql file with sample queries to create a users table and insert some data into the database. You can use that in the sqlite cli using:
  ```.read sample.sql```

You can stop the database without deleting the container using:
  ```make stop```

You can stop the database and also delete the container using:
  ```make down```

You can exit from the sqlite cli using:
  ```.quit```

I have implemented docker volume for persistence of the database data, so even you delete the container and restart it, the data from your previous database will still be present.
=======
# Crypto-Tracker

## Setting up docker:
Install docker desktop from https://docs.docker.com/desktop/install/windows-install/ for windows or https://docs.docker.com/desktop/install/mac-install/ for mac.

## Starting the container for database and accessing the database cli:
Clone this repository to your working directory and from that directory run these commands to(make sure to run these commands from the directory where the Makefile is present):

Start the database container:
  ```make up```

Access the database cli:
  ```make cli```

You can create (or) open an existing database using the below command in sqlite cli:
  ```.open sample.db```

I have also provided a sample.sql file with sample queries to create a users table and insert some data into the database. You can use that in the sqlite cli using:
  ```.read sample.sql```

You can stop the database without deleting the container using:
  ```make stop```

You can stop the database and also delete the container using:
  ```make down```

You can exit from the sqlite cli using:
  ```.quit```

I have implemented docker volume for persistence of the database data, so even you delete the container and restart it, the data from your previous database will still be present.
>>>>>>> 6daa86c (Add project setup)
