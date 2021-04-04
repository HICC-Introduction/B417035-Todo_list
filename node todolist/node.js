var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var express = require("express");
var app = express();

app.use(express.static(__dirname + "/"));
app.listen(3000, function () {});

function templateHTML(title, list, body, footer) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>List - ${title}</title>
      <script
        src="https://kit.fontawesome.com/777f63b292.js"
        crossorigin="anonymous"
      ></script>
      <link rel="stylesheet" href="style.css" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>
      <!-- Navbar -->
      <nav id="navbar">
        <div class="navbar__logo">
          <a href="/"><i class="far fa-check-circle"></i> Todo_list</a>
        </div>
        <div class="navbar__menu">
          <div class="searchBar">
            <input
              onkeyup="filter()"
              type="text"
              id="value"
              placeholder="Type to Searach"
            />
            <i class="fas fa-search"></i>
          </div>

          <button class="navbar__menu__item">작성</button>
        </div>
      </nav>

      <!-- Aside -->
      <aside id="sheet">
      ${list}
      <a href="/create">create</a>
      </aside>

      ${body}

      ${footer}

    </body>
  </html>
  `;
}

function templateList(filelist) {
  var list = '<ul class="sheet__items">';
  var i = 0;
  while (i < filelist.length) {
    list =
      list +
      `<li><a href="/?id=${filelist[i]}">${filelist[i]}<button class="sheet__delete"><i class="fas fa-trash-alt"></i></button></li>`;
    i = i + 1;
  }
  list = list + "</ul>";
  return list;
}

function templateBody(title, edit) {
  return `<section id="main">
  <div class="main__top">
    <div class="main__title">
      <h1>${title}</h1>
      ${edit}
    </div>
    <ul class="main__menu">
      <li>Sort by</li>
      <!-- <li class="main__menu__item">Write</li> -->
      <li class="main__menu__item" onclick="sortTable(0)">Title</li>
      <li class="main__menu__item" onclick="sortTable(1)">Due Date</li>
      <li class="main__menu__item" onclick="sortTable(2)">Priority</li>
    </ul>
  </div>
  <div class="item__divider" style="margin-bottom: 20px"></div>

  <table class="main__middle" id="table" onchange="sortChecked()">
    <tbody class="main__middle__body">
      <tr>
        <td class="main__middle__title" style="text-align: center">
          Title
        </td>
        <td class="main__middle__duedate">Due Date</td>
        <td class="main__middle__priority">Priority</td>
        <td class="main__middle__btn"></td>
      </tr>
    </tbody>
  </table>
</section>`;
}

var templateFooter = `<!-- Footer -->
  <footer id="footer">
    <input
      type="text"
      class="footer__input"
      placeholder="Type to add an item simply"
    />
    <button class="footer__button"><i class="fas fa-plus"></i></button>
  </footer>`;

var app = http.createServer(function (request, response) {
  var _url = request.url;
  // console.log(_url);
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function (error, filelist) {
        var title = "Welcome!";
        var description = "Welcome!";
        //   var list = `<ul class="sheet__items">
        //   <p class="sheet__title">목록</p>
        //   <li class="sheet__item selected" data-filter="*">
        //     <a href="/?id=전체">전체</a>
        //   </li>
        //   <li class="sheet__item" data-filter="Todo List">
        //     <a href="/?id=Todo List">Todo List</a
        //     ><button class="sheet__delete">
        //       <i class="fas fa-trash-alt"></i>
        //     </button>
        //   </li>
        //   <li class="sheet__item" data-filter="살 거">
        //     <a href="/?id=살 거">살 거</a
        //     ><button class="sheet__delete">
        //       <i class="fas fa-trash-alt"></i>
        //     </button>
        //   </li>
        //   <li class="sheet__item" data-filter="etc">
        //     <a href="/?id=etc">etc</a
        //     ><button class="sheet__delete">
        //       <i class="fas fa-trash-alt"></i>
        //     </button>
        //   </li>
        //   <li class="sheet__item">
        //     <input type="text" />
        //     <button class="sheet__plus_item">
        //       <i class="fas fa-plus"></i>
        //     </button>
        //   </li>
        // </ul>`;

        var list = templateList(filelist);

        var footer = "";

        var template = templateHTML(title, list, description, footer);
        response.end(template);
      });
    } else {
      fs.readdir("./data", function (error, filelist) {
        fs.readFile(
          `data/${queryData.id}`,
          "utf8",
          function (err, description) {
            var title = queryData.id;
            var list = templateList(filelist);
            var footer = templateFooter;
            var template = templateHTML(title, list, description, footer);
            response.end(template);
          }
        );
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (error, filelist) {
      var title = "create";
      var list = templateList(filelist);
      var footer = "";
      var template = templateHTML(
        title,
        list,
        `<span>추가하고자 하는 목록의 이름을 입력해주세요</span>
        <form action="/process_create" method="post">
      <p><input type="text" name="title" /></p>
      <p>
        <input type="submit" />
      </p>
    </form>
    `,
        footer
      );
      response.end(template);
    });
  } else if (pathname === "/process_create") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = templateBody(
        title,
        `<a href="/update?id=${title}" class="main__title__edit">
            이름 변경
         </a>
         <form action="process_delete" method="post">
            <input type="hidden" name="id" value="${title}">
            <input type="submit" value="delete">
         </form>`
      );
      fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("./data", function (error, filelist) {
      fs.readFile(`data/${queryData.id}`, "utf8", function (err, description) {
        var title = queryData.id;
        var list = templateList(filelist);
        var footer = templateFooter;
        var template = templateHTML(
          title,
          list,
          `
          <form action="/process_update" method="post">
          <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" value="${title}"/></p>
        <p>
          <input type="submit" />
        </p>
      </form>`,
          footer
        );
        response.end(template);
      });
    });
  } else if (pathname === "/process_update") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = templateBody(
        title,
        `<a href="/update?id=${title}" class="main__title__edit">
            이름 변경
         </a>
         <form action="process_delete" method="post">
            <input type="hidden" name="id" value="${title}">
            <input type="submit" value="delete">
         </form>`
      );
      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, "utf8", function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
    });
  } else if (pathname === "/process_delete") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, function (error) {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
