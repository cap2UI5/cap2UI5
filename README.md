# 🚀 cap2UI5

Bringing the [abap2UI5](https://github.com/abap2UI5/abap2UI5) concept to CAP/Node.js — a fun exploration of JavaScript, TypeScript, and CAP!

### Features
* XML creation in the backend
* Data binding and exchange
* Persistence and session handling

### Quick Demo

Run the following command to start the project:
``` 
npx cds w
```

### Example Code
```js
class z2ui5_cl_app_hello_world {
  async main(client) {

    this.NAME ??= 'test';

    client.oView
      .Page({ title: "abap2UI5 - Hello World" })
      .Title({ text: "Make an input here and send it to the server..." })
      .Input({ 
        value: client._bind_edit(this.NAME), 
        enabled: true 
      })
      .Button({ 
        press: client._event('BUTTON_POST'), 
        text: "Post" 
      });

    client.display_view(client.oView.stringify());
  }
}

module.exports = z2ui5_cl_app_hello_world;
```

### Contribution
Contributions are welcome! Feel free to fork the project, submit issues, or create pull requests.

### License
This project is licensed under the MIT License.
