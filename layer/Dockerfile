FROM public.ecr.aws/amazonlinux/amazonlinux:2023

# Install Python 3.12 and other necessary packages
RUN dnf install -y python3.12 python3.12-pip \
    fontconfig dejavu-sans-fonts zip findutils

# Create layer directory
RUN mkdir -p /layer/fonts /layer/lib64

# Copy only the essential files
RUN echo '<?xml version="1.0"?>\
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\
<fontconfig>\
  <dir>/var/task/fonts</dir>\
</fontconfig>' > /layer/fonts/fonts.conf

# Find and copy the DejaVuSans.ttf font
RUN font_path=$(find /usr/share/fonts -name "DejaVuSans.ttf" | head -n 1) && \
    if [ -n "$font_path" ]; then \
        cp "$font_path" /layer/fonts/; \
    else \
        echo "DejaVuSans.ttf not found"; \
        exit 1; \
    fi

# Copy required libraries
RUN cp /usr/lib64/libfontconfig.so* /layer/lib64/ && \
    cp /usr/lib64/libfreetype.so* /layer/lib64/ && \
    cp /usr/lib64/libexpat.so* /layer/lib64/ && \
    cp /usr/lib64/libuuid.so* /layer/lib64/

# Create zip file
RUN cd /layer && zip -r9 /layer.zip *

# Print the contents of the layer for verification
RUN echo "Contents of /layer/fonts:" && ls -l /layer/fonts && \
    echo "Contents of /layer/lib64:" && ls -l /layer/lib64

CMD ["/bin/bash"]
