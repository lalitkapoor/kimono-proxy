FROM ubuntu
EXPOSE 80
ENV PORT PORT}
ENV URL {URL}
ENV CONFIG_LINK {CONFIG_LINK}

RUN apt-get install -y software-properties-common python-software-properties python curl
RUN add-apt-repository -y ppa:chris-lea/node.js
RUN echo "deb http://us.archive.ubuntu.com/ubuntu/ precise universe" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y nodejs

RUN mkdir /var/www
RUN cd /var/www && curl -L -o proxy.tar.gz "https://github.com/lalitkapoor/node-api-proxy/tarball/master"
RUN cd /var/www && tar -zxvf proxy.tar.gz --strip 1 && npm install

CMD cd /var/www && npm start