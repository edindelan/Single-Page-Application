console.log("Application started!");

var data = [{
        id: 1,
        author: "Michael Londoni",
        title: "Darkness of the Space",
        url: "https://michael.com"
    },
    {
        id: 2,
        author: "Ana Grey",
        title: "Cabin in the woods",
        url: "http://anagrey.de"
    },
    {
        id: 3,
        author: "Lori Smidth",
        title: "Eine shone Sontag",
        url: "https://lori.de"
    }];

var navigation = [{
        id: 'nav_home',
        title: 'Home',
        url: '#'
},
    {
        id: 'nav_blogs',
        title: 'Blogs',
        url: '#blogs'
},
    {
        id: 'nav_users',
        title: 'Users',
        url: '#users'
}];

var Blog = Backbone.Model.extend({
    defaults: {
        author: "",
        title: "",
        url: ""
    }
});

var Blogs = Backbone.Collection.extend({
    model: Blog
});

var NavigationView = Backbone.View.extend({
    el: '.navigation-container',

    collection: new Backbone.Collection(),

    events: {
        'click a': 'click'
    },

    click: function (e) {
      console.log($(e.currentTarget).attr('id').replace('nav_', ''));
    },

    template: _.template($('.navigation-template').html()),

    initialize: function () {
      this.collection.set(navigation);
      console.log(this.collection);
      this.render();
    },

    render: function () {
        this.collection.each(this.renderNavItem, this);
    },

    renderNavItem: function (model) {
        this.$el.append(this.template(model.toJSON()));
    }

});

var HomeLayoutView = Backbone.View.extend({
    el: ".app-container",
    template: _.template($('.home-layout-template').html()),
    initialize: function () {
       console.log("Home layout inited!")
       this.render();
       var view = new BlogListView({
            collection: new Blogs(data)
       });
    },
    render: function () {
        this.$el.html(this.template());
    }
});

var BlogsLayoutvView = Backbone.View.extend({
    el: '.app-container',
    initialize: function () {
      this.render();
    },
    render: function () {
        this.$el.html("<h2>Blog page</h2>");
    }
});

var UsersLayoutvView = Backbone.View.extend({
    el: '.app-container',
    initialize: function () {
      this.render();
    },
    render: function () {
        this.$el.html("<h2>Users page</h2>");
    }
});

var BlogAddView = Backbone.View.extend({
    el: '.add-blog-container',

    events: {
        'click .add-blog': 'addBlog'
    },

    addBlog: function () {
        var blog = {
            author: $('.author-input').val(),
            title: $('.title-input').val(),
            url: $('.url-input').val(),
        };
        this.collection.add(blog);
        this.render();
    },

    template: _.template($('.add-blog-template').html()),



    render: function () {
        this.$el.html("");
        this.$el.append(this.template());
    }
});

var BlogListView = Backbone.View.extend({
    el: ".blogs-list",

    initialize: function () {
        var addView = new BlogAddView({collection: this.collection});
        addView.render();
        this.render();
        this.listenTo(this.collection, 'add', this.renderItem);
        this.listenTo(this.collection, 'remove', this.render);
    },

    render: function () {
        console.log("BlogList layout inited!")
        this.$el.html("");

        this.collection.each(this.renderItem.bind(this));
        console.log(this.collection.toJSON());
    },

    renderItem: function (model) {
        console.log(model);
        var itemView = new BlogItemView({
            model: model
        });
        this.$el.append(itemView.render().el);
    }
});

var BlogItemView = Backbone.View.extend({
    tagName: 'tr',

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'remove', this.render);
    },

    events: {
        'click .edit-blog':      'editBlog',
        'click .delete-blog':    'deleteBlog',
        'click .update-blog':    'updateBlog',
        'click .cancel-editing': 'cancelEditing',
        'dblclick .row-field':   'editBlog'
    },

    editBlog: function () {
        console.log("Edit Blog: " + this.model.toJSON().author);
        this.$el.html(this.editBlogTemplate(this.model.toJSON()));
        console.log(this.model);
    },

    deleteBlog: function () {
        console.log(this);
        this.model.destroy();
        this.render();
    },

    updateBlog: function () {
        console.log("dasdas");
        this.model.set({
            author: this.$('.author-input').val(),
            title: this.$('.title-input').val(),
            url: this.$('.url-input').val()
        });

        if (_.isEmpty(this.model.changed)) {
            this.model.trigger('change');
        };

    },

    cancelEditing: function () {
        this.render();
    },

    template: _.template($('.blogs-list-template').html()),
    editBlogTemplate: _.template($('.edit-blog-template').html()),

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var Router = Backbone.Router.extend({
    routes: {
        '':      'home',
        'blogs': 'blogs',
        'users': 'users'
    },

    home: function () {
        new HomeLayoutView();
    },

    blogs: function () {
        new BlogsLayoutvView();
    },

    users: function () {
        new UsersLayoutvView();
    },
})

new Router;
Backbone.history.start();
new NavigationView();
