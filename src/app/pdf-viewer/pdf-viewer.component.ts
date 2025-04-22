import { Component, OnInit } from '@angular/core';
import NutrientViewer from '@nutrient-sdk/viewer';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrl: './pdf-viewer.component.css',
  standalone: true
})
export class PdfViewerComponent implements OnInit {
  ngOnInit(): void {
    NutrientViewer.load({
      baseUrl: `${location.protocol}//${location.host}/assets/`,
      document: "/assets/document.pdf",
      container: "#nutrient-container",
    }).then(instance => {
      (window as any).instance = instance;
    });
  }
}
