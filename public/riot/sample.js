riot.tag2('sample', '<h3>{opts.title}</h3> <ul> <li each="{item, i in items}">{item}</li> </ul> <form onsubmit="{add}"> <input type="text"> <button>Add #{items.length + 1}</button> </form> <button onclick="{del}">Del</button>', '', '', function(opts) {
    this.items = [];

    this.add = function(e) {
      var input = e.target[0];
      this.items.push(input.value);
      input.value = '';
    }.bind(this)

    this.del = function() {
      this.items.pop();
    }.bind(this)
});
