import * as ts from 'typescript';
import { oneLine, stripIndent } from 'common-tags';
import { transformTypescript } from './ast_helpers';
import { replaceResources } from './replace_resources';

describe('@ngtools/webpack transformers', () => {
  describe('replace_resources', () => {
    it('should replace resources', () => {
      const input = stripIndent`
        import { Component } from '@angular/core';

        @Component({
          selector: 'app-root',
          templateUrl: './app.component.html',
          styleUrls: ['./app.component.css', './app.component.2.css']
        })
        export class AppComponent {
          title = 'app';
        }
      `;
      const output = stripIndent`
        import * as tslib_1 from "tslib";
        import { Component } from '@angular/core';
        let AppComponent = class AppComponent {
            constructor() {
                this.title = 'app';
            }
        };
        AppComponent = tslib_1.__decorate([
            Component({
                selector: 'app-root',
                template: require("./app.component.html"),
                styles: [require("./app.component.css"), require("./app.component.2.css")]
            })
        ], AppComponent);
        export { AppComponent };
      `;

      const transformOpsCb = (sourceFile: ts.SourceFile) => replaceResources(sourceFile);
      const result = transformTypescript(input, transformOpsCb);

      expect(oneLine`${result}`).toEqual(oneLine`${output}`);
    });
  });
});
