// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')
var $ = require('jquery'),
	Backbone = require('backbone')

console.log('loaded javascript')


var EtsyCollection=Backbone.Collection.extend({
	
	url: "https://openapi.etsy.com/v2/listings/active.js",
	apiKey:"v4scom4wfeznsgrvftmz39if",

	// parse:function(responseData){
	// 	console.log(responseData);
	// }


})

var HomeView=Backbone.View.extend({
	
	el:"#container",
	events: {
        "click .image": "showItem",
        "click .title": "showItem"

    },

    showItem:function(event){
    	console.log(event);
    },

	getImgSource:function(listing){
		if(listing.Images[0].length===0){
			return "https://vignette1.wikia.nocookie.net/thefakegees/images/8/86/Il_170x135.434854012_ipww.jpg"
		}
		else {return	listing.Images[0].url_570xN}
	},

	getTitle:function(listing){
		return listing.title
	},

	getPrice:function(listing){
		var symbols={USD:"$",GBP:"£"}
		return symbols[listing.currency_code]+listing.price+" "+listing.currency_code
	},

	render:function(){

		console.log(this.collection.models[0].attributes.results)
	var activeListings= this.collection.models[0].attributes.results;
	var htmlString="<h3>Shop our latest handpicked collections</h3>";
	var self=this
	activeListings.forEach(function(listing){
		htmlString+=`<div class="listing">\
				<div class="image" style="background-image:url(${self.getImgSource(listing)})"></div>\
				<p class="title">${self.getTitle(listing)}</p>\
				<p>${self.getPrice(listing)}</p>

				</div>`
	})

	$('#listings-container').html(htmlString);
	}

	// initialize: function(){
	// 	this.listenTo(this.collection, 'sync', this.render)
	// }
})

var DetailsView=Backbone.View.extend({

	
})


var Router=Backbone.Router.extend({

routes:{
	'home':'showHome'
},

	showHome:function(){
		console.log("splitText(offset)")
		var self=this
		var renderView = this.home.render.bind(this.home)

		this.etsy.fetch({
			dataType: 'jsonp',
			data: {
				"api_key": this.etsy.apiKey,
				includes: 'Images'	
			},
			processData: true
		}).done(renderView)
	
	},



initialize:function(){
	this.etsy=new EtsyCollection()
	this.home=new HomeView({collection:this.etsy})
	// this.details=new DetailsView({model:this.etsy})
	Backbone.history.start();
}

})

var router=new Router();

