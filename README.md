
# DomDomShow

🎨 DomDomShow is a web-based tool that lets you easily create and share your own presentations.

# Live Demo
🔗 Check out our live demo to see DomDomShow in action: [Live Demo](https://domdomshow-tw.web.app/)

<a href="https://domdomshow-tw.web.app/"><img title="Click to Go!" src="https://user-images.githubusercontent.com/110733945/223671267-f3efd749-a5de-469c-81e6-4f1424cfeffa.JPG" width="600" aspect-ratio=16/9></a>

🔑 Test account and password

| Account             | Password |
|------------------|----------|
| `test999@test.com` | `12345678` |

# Detail Skills

### Front-end

<table class="tg">
<thead>
  <tr>
    <th class="tg-c3ow"><span style="font-weight:bold">Technique</span></th>
    <th class="tg-c3ow"><span style="font-weight:bold">Description</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">React Hook </td>
    <td class="tg-0pky">building reusable UI</td>
  </tr>
  <tr>
    <td class="tg-0pky">React Context</td>
    <td class="tg-0pky">Global State Management</td>
  </tr>
  <tr>
    <td class="tg-0pky">JSX</td>
    <td class="tg-0pky">Write HTML in JS</td>
  </tr>
  <tr>
    <td class="tg-0pky">React Router</td>
    <td class="tg-0pky">SPA</td>
  </tr>
  <tr>
    <td class="tg-0pky">JavaScript ES6</td>
    <td class="tg-0pky">Module, Template Literals...</td>
  </tr>
  <tr>
    <td class="tg-0pky">styled-components </td>
    <td class="tg-0pky">CSS-in-JS</td>
  </tr>
    <tr>
    <td class="tg-0pky">SVG </td>
    <td class="tg-0pky">Scalable Vector Graphics</td>
  </tr>
</tbody>
</table>

### Back-end

<table class="tg">
<thead>
  <tr>
    <th class="tg-c3ow"><span style="font-weight:bold">Technique</span></th>
    <th class="tg-c3ow"><span style="font-weight:bold">Description</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">Firestore</td>
    <td class="tg-0pky">Database</td>
  </tr>
  <tr>
    <td class="tg-0lax">Firebase Hosting</td>
    <td class="tg-0lax">Web Server</td>
  </tr>
  <tr>
    <td class="tg-0lax">Firebase Auth</td>
    <td class="tg-0lax">Member System</td>
  </tr>
</tbody>
</table>

### Development Tool

<table class="tg">
<thead>
  <tr>
    <th class="tg-c3ow"><span style="font-weight:bold">Technique</span></th>
    <th class="tg-c3ow"><span style="font-weight:bold">Description</span></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky">webpack</td>
    <td class="tg-0pky">bundle JS</td>
  </tr>
  <tr>
    <td class="tg-0lax">Babel</td>
    <td class="tg-0lax">JS Compiler</td>
  </tr>
  <tr>
    <td class="tg-0lax">NPM</td>
    <td class="tg-0lax">package manager tool</td>
  </tr>
  <tr>
    <td class="tg-0lax">ESLint / Prettier</td>
    <td class="tg-0lax">Linter Tool</td>
  </tr>
  <tr>
    <td class="tg-0lax">GitHub</td>
    <td class="tg-0lax">Git Tool</td>
  </tr>
</tbody>
</table>

### Front-end
- Use `React Hook` and `React Router` build the single page application(SPA) for better user experience.
- Use `React Context` manage the global state of member login or not, passing state through nested components tree.
- Use `JSX` and `styled-components` can write HTML elements and styles directly in the JS component. This approach results in more intuitive and semantic code, which helps developers write code more efficiently. 
- `SVG` `circle` and `path` elements are used to achieve the mind map on the canvas.

### Back-end
Use `Firebase` set up the website, including Hosting for web hosting, `Auth` for membership system, and `Firestore` for database operations.

## Component Structure

![image](https://user-images.githubusercontent.com/110733945/223780017-c4c1b2af-c112-470a-9b97-cb8852558f8d.png)

Routers identify main components, namely Welcome, Member, Account, and Draw, which are subdivided based on complexity. 
Header, Loading and Layer are shared component.

The four main components store their states separately, which are then passed down to child components via props. 
Member states are stored at the top layer of the App and passed down to child components through the Context API. 
The Save feature enables members to store data in Firebase Firestore.

## Feature

### 1️⃣ Edit Title

The title can be changed at any time, as desired.

![title](https://user-images.githubusercontent.com/110733945/223907084-470c22b0-8778-4e8e-a452-323f544146e7.gif)

### 2️⃣ Create node and line

Create a new node by dragging and dropping, and create new nodes in the desired direction based on it.

![create](https://user-images.githubusercontent.com/110733945/223906571-bc35c2e2-b3ec-4d2e-89c0-760c022a5f5b.gif)

### 3️⃣ Shape the line

The line can be adjusted to the desired position by using points on it, which are based on the principle of Bezier curves.

![shape](https://user-images.githubusercontent.com/110733945/223908217-5c4915f4-4d4e-4f85-ba5b-e39304f291a1.gif)

### 4️⃣ Comment board

Users can add titles and comments to each node through the comment board, or they can double-click on a node to add a title directly to it.

![comment](https://user-images.githubusercontent.com/110733945/223909510-b801382c-39e5-4e28-94ee-f7aebec3e248.gif)

### 5️⃣ Text font & Node color

![font](https://user-images.githubusercontent.com/110733945/223910602-1f543c58-ce06-4c9f-8756-cff66a86abfe.gif)

### 6️⃣ zoom

To zoom in or out of the working area of the mind map, you can click the Zoom In/Out button on the zoom toolbar located in the lower-right corner of the canvas. Alternatively, you can hold down the `Ctrl` key and scroll your mouse wheel to zoom in or out.

![zoom](https://user-images.githubusercontent.com/110733945/223913173-981c2146-15fc-4ca3-a5ab-e5a735ca9a7b.gif)

### 7️⃣ Hotkey
| ACTION  | HOTKEY        |
|---------|---------------|
| Zoom    | ctrl + scroll |
| Delete  | delete        |
| Panmode | space         |

## Contact

If you have any question or suggestion, welcome to contact this mail:  dknyzzz777@gmail.com<br>

Have a good day!
