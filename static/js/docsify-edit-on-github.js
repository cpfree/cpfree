!function(t) {
   t.EditOnGithubPlugin = {}, t.EditOnGithubPlugin.create = function(n, i, e) {
       function u(t) {
           return header = ['<div style="overflow: auto">', 
           '<p><a style="text-decoration: underline; cursor: pointer"', 'onclick="EditOnGithubPlugin.onClick(event)">', 
           t, "</a></p>", "</div>"].join("")
       }
       return e = e || "Edit on github", i = i || n.replace(/\/blob\//, "/edit/"), t.EditOnGithubPlugin.editDoc = function(t, n) {
               var e = n.route.file;
               if (e) {
                   var u = i + e;
                   return window.open(u), t.preventDefault(), !1
               }
               return !0
           },
           function(n, i) {
               if (t.EditOnGithubPlugin.onClick = function(t) {
                       EditOnGithubPlugin.editDoc(t, i)
                   }, (r = e) && "[object Function]" === {}.toString.call(r)) n.afterEach(function(t) {
                   return u(e(i.route.file)) + t
               });
               else {
                   var o = u(e);
                   n.afterEach(function(t) {
                       return o + t
                   })
               }
               var r
           }
   }
}(window);
//# sourceMappingURL=https://cdn.jsdelivr.net/sm/eef821f4877f09e27be373326100cefe923735a9bb303de51b16f9079d063a86.map