import * as HeroUI from "@heroui/react";

const tabExports = Object.keys(HeroUI).filter(k => k.toLowerCase().includes('tab'));
console.log("HeroUI Tab exports:", tabExports);
