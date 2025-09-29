ALTER TABLE image ADD CONSTRAINT unique_image_name_per_container UNIQUE (image_name, container);
