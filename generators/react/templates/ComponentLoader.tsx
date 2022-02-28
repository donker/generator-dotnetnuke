import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppManager } from "./AppManager";
import Foo from "./Components/Foo";

export class ComponentLoader {
  public static load(): void {
    document.querySelectorAll(".<%= Name %>").forEach((el) => {
      var moduleId = el.dataInt("moduleid");
      ReactDOM.render(
        <Foo
          module={AppManager.Modules.Item(moduleId.toString())}
          bar={el.dataString("bar", "foobar")}
        />,
        el
      );
    });
  }
}
