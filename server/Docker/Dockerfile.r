FROM r-base:latest

# Install packages
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    pandoc \
    && R -e "install.packages(c('ggplot2', 'plotly', 'jsonlite', 'htmlwidgets'), repos='http://cran.rstudio.com/')"

WORKDIR /app

# Accept script path via CMD
ENTRYPOINT ["Rscript"]
