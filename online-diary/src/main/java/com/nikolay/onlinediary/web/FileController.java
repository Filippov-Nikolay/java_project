package com.nikolay.onlinediary.web;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {

        List<String> storageDirs = List.of("uploads/submissions", "uploads/icons");

        for (String dir : storageDirs) {
            try {
                Path filePath = Paths.get(dir).resolve(fileName).normalize();
                Resource resource = new UrlResource(filePath.toUri());

                if (resource.exists() && resource.isReadable()) {

                    String contentType = Files.probeContentType(filePath);
                    if (contentType == null) {
                        contentType = "application/octet-stream";
                    }

                    String contentDisposition = ContentDisposition.attachment()
                            .filename(fileName, StandardCharsets.UTF_8)
                            .build()
                            .toString();

                    log.info("Serving file: {} from directory: {}", fileName, dir);

                    return ResponseEntity.ok()
                            .contentType(MediaType.parseMediaType(contentType))
                            .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                            .body(resource);
                }
            } catch (Exception e) {
                log.error("Error accessing file {} in directory {}: {}", fileName, dir, e.getMessage());
            }
        }

        log.warn("File not found: {}", fileName);
        return ResponseEntity.notFound().build();
    }
}