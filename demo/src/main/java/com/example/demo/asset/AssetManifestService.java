package com.example.demo.asset;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AssetManifestService {

    private static final Logger logger = LoggerFactory.getLogger(AssetManifestService.class);
    private static final String MANIFEST_PATH = "static/asset-manifest.json"; // CRA default

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<String> getCssAssets() {
        List<String> assets = readFromManifest("css");
        logger.info("CSS Assets: {}", assets);
        return assets;
    }

    public List<String> getJsAssets() {
        List<String> assets = readFromManifest("js");
        logger.info("JS Assets: {}", assets);
        return assets;
    }

    private List<String> readFromManifest(String type) {
        try {
            Resource manifest = new ClassPathResource(MANIFEST_PATH);
            if (!manifest.exists()) {
                return fallback(type);
            }
            try (InputStream is = manifest.getInputStream()) {
                JsonNode root = objectMapper.readTree(is);
                Set<String> assets = new HashSet<>();

                // CRA format: use entrypoints (preferred)
                if (root.has("entrypoints") && root.get("entrypoints").isArray()) {
                    for (JsonNode ep : root.get("entrypoints")) {
                        String p = ep.asText("");
                        if (p.endsWith(".js") && "js".equals(type)) assets.add(p);
                        if (p.endsWith(".css") && "css".equals(type)) assets.add(p);
                    }
                }

                // CRA files map fallback
                if (assets.isEmpty() && root.has("files")) {
                    JsonNode files = root.get("files");
                    files.fields().forEachRemaining(e -> {
                        String val = e.getValue().asText("");
                        if (val.endsWith(".js") && "js".equals(type)) assets.add(val);
                        if (val.endsWith(".css") && "css".equals(type)) assets.add(val);
                    });
                }

                List<String> list = new ArrayList<>(assets);
                Collections.sort(list);
                if (list.isEmpty()) return fallback(type);
                return list;
            }
        } catch (IOException ex) {
            return fallback(type);
        }
    }

    private List<String> fallback(String type) {
        List<String> list = new ArrayList<>();
        if ("css".equals(type)) {
            list.add("/static/css/main.css"); // typical CRA path when served not from classpath mapping
            list.add("/css/main.css"); // when static mapped to /
            list.add("/css/server.css"); // our server-side styles
        } else if ("js".equals(type)) {
            list.add("/static/js/bundle.js"); // dev-like fallback
            list.add("/js/main.js"); // prod-like generic
        }
        return list;
    }
}
