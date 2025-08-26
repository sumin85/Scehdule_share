package com.example.demo.config;

import com.example.demo.asset.AssetManifestService;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.util.List;

@ControllerAdvice
public class GlobalViewAttributes {

    private final AssetManifestService assetManifestService;

    public GlobalViewAttributes(AssetManifestService assetManifestService) {
        this.assetManifestService = assetManifestService;
    }

    @ModelAttribute("frontendCssAssets")
    public List<String> frontendCssAssets() {
        return assetManifestService.getCssAssets();
    }

    @ModelAttribute("frontendJsAssets")
    public List<String> frontendJsAssets() {
        return assetManifestService.getJsAssets();
    }
}
