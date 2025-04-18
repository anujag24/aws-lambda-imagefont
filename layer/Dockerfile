FROM public.ecr.aws/amazonlinux/amazonlinux:2023

# Install necessary packages
RUN dnf install -y \
    fontconfig \
    dejavu-sans-fonts \
    zip \
    findutils \
    && dnf clean all \
    && rm -rf /var/cache/dnf

# Create layer directory structure
RUN mkdir -p /layer/fonts /layer/lib64

# Create fonts.conf
RUN echo '<?xml version="1.0"?>\
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\
<fontconfig>\
  <dir>/opt/fonts</dir>\
</fontconfig>' > /layer/fonts/fonts.conf

# Find and copy the DejaVuSans.ttf font
RUN font_path=$(find /usr/share/fonts -name "DejaVuSans.ttf" | head -n 1) && \
    if [ -n "$font_path" ]; then \
        cp "$font_path" /layer/fonts/; \
        echo "Font copied from: $font_path"; \
    else \
        echo "DejaVuSans.ttf not found" && exit 1; \
    fi

# Copy required shared libraries and their dependencies
RUN cp -P /usr/lib64/libfontconfig.so* /layer/lib64/ && \
    cp -P /usr/lib64/libfreetype.so* /layer/lib64/ && \
    cp -P /usr/lib64/libexpat.so* /layer/lib64/ && \
    cp -P /usr/lib64/libuuid.so* /layer/lib64/ && \
    cp -P /usr/lib64/libpng*.so* /layer/lib64/ && \
    cp -P /usr/lib64/libbz2.so* /layer/lib64/ && \
    echo "Libraries copied successfully"

# List all copied files for verification
RUN echo "Contents of /layer/fonts:" && \
    ls -l /layer/fonts && \
    echo "Contents of /layer/lib64:" && \
    ls -l /layer/lib64

# Create zip file
RUN cd /layer && \
    zip -r9 /layer.zip * && \
    echo "Layer zip created successfully"

# Verify zip contents
RUN unzip -l /layer.zip

# Command to help with debugging
CMD ["bash"]
