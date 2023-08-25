import * as path from "path";
import { writeFileSync } from "fs";
import { mkdir } from "shelljs";

class SimpleHtmlPlugin {
  private options: {
    template?: string;
    title?: string;
    dir: string;
  };

  constructor(options: SimpleHtmlPluginOptions) {
    this.options = options;
  }

  apply() {
    const dir = this.options.dir;
    const templatePath = path.resolve(dir, "index.html");

    // 生成最终 HTML 内容
    const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${this.options.title || "My App"}</title>
                </head>
                <body>
                    <div id="app"></div>
                    <script src="./dist.js"></script>
                </body>
                </html>
            `;

    mkdir("-p", dir);
    writeFileSync(templatePath, htmlContent); // join(dir, "index.html")
  }
}

interface SimpleHtmlPluginOptions {
  template?: string;
  title?: string;
  dir: string;
}

export default SimpleHtmlPlugin
