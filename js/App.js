console.log("Application started!");

var data = [{
        author: "Edin Blog",
        title: "Edin",
        url: "neki.com"
    },
    {
        author: "Lord Blog",
        title: "Nikita",
        url: "nekisajt.com"
    },
    {
        author: "Ludilo Blog",
        title: "Samuel",
        url: "ludnica.com"
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

var BlogAddView = Backbone.View.extend({
    el: $('.add-blog-container'),

    events: {
        'click .add-blog': 'addBlog'
    },

    addBlog: function () {
        var blog = {
            author: $('.author-input').val(),
            title: $('.title-input').val(),
            url: $('.url-input').val(),
        };
        blogs.add(blog);
        this.render();
    },

    template: _.template($('.add-blog-template').html()),



    render: function () {
        this.$el.html("");
        this.$el.append(this.template());
    }
})

var BlogListView = Backbone.View.extend({
    el: $(".blogs-list"),

    initialize: function () {
        var addView = new BlogAddView();
        addView.render();
        this.render();
        this.listenTo(this.collection, 'add', this.renderItem);
        this.listenTo(this.collection, 'remove', this.render);
    },

    render: function () {
        this.$el.html("");

        this.collection.each(this.renderItem.bind(this));
        console.log(this.collection.toJSON());
    },

    renderItem: function (model) {
        console.log(model);
        var itemView = new BlogItemView({ model: model });
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
        'click .edit-blog':       'editBlog',
        'click .delete-blog':     'deleteBlog',
        'click .update-blog':     'updateBlog',
        'click .cancel-editing':  'cancelEditing',
        'dblclick .row-field':             'editBlog'
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

        if(_.isEmpty(this.model.changed)){
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

var blogs = new Blogs(data);

var view = new BlogListView({collection: blogs});










































