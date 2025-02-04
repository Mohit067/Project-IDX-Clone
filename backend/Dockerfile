FROM ubuntu:20.04

# setup user
RUN useradd -ms /bin/bash sandbox

# setup working directory
WORKDIR /home/sandbox

# update the ubuntu machine
RUN apt update && apt upgrade -y

# install nano and curl
RUN apt install nano curl -y


# install node js
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs


# configuring terminal to display current working directory
RUN mkdir -p /home/sandbox && echo "PS1='\w '" >> /home/sandbox/.bashrc



# setup final working directory
WORKDIR /home/sandbox/app