// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')
var $ = require('jquery'),
    Backbone = require('backbone')

console.log('loaded javascript')

var index;

var ItemModel = Backbone.Model.extend({


    url: "https://openapi.etsy.com/v2/listings/",



    // parse:function(responseData){

    // 	console.log(responseData);
    // 	return responseData
    // }

})

var EtsyCollection = Backbone.Collection.extend({

    url: "https://openapi.etsy.com/v2/listings/active.js",
    apiKey: "v4scom4wfeznsgrvftmz39if",


    // parse:function(responseData){
    // 	console.log(responseData);
    // }


})

var HomeView = Backbone.View.extend({

    el: "#container",

    events: {
        "click .image": "getListingId",
        "click .title": "getListingId",
        "keypress input": "getSearchResults",
        // "click #lastWeek":"showLastWeek"

    },
    // showLastWeek:function(event){
    //     console.log(event.target.checked)
    // },

    getSearchResults:function(event){
    	if(event.keyCode===13){
    		var query=event.target.value;
    		location.hash=`search/${query}`
    	}
    },

    getListingId: function(event) {
        var element = event.target;
        var itemId = element.getAttribute('data-item-id');
        location.hash = `details/${itemId}`
    },

    getImgSource: function(listing) {
        if (!listing['Images']) { // didnt solve the problem!
            return "https://vignette1.wikia.nocookie.net/thefakegees/images/8/86/Il_170x135.434854012_ipww.jpg"
        } else {
            return listing.Images[0].url_570xN
        }
    },

    getTitle: function(listing) {
        return listing.title
    },

    getPrice: function(listing) {
        var symbols = {
            USD: "$",
            GBP: "£",
            EUR: "€",
            AUD: "AU$"
        }
        return symbols[listing.currency_code] + listing.price + " " + listing.currency_code
    },


   
    render: function() {

        var activeListings = this.collection.models[0].attributes.results;
        // var htmlString=`<div id="filter"> <p>Filter by:</p>
        // <input type="checkbox" id="lastWeek" value="1"/><label for="lastWeek">Posted in the last week</label>
        // <input type="checkbox" id="Tpictures" value="3"/><label for="Tpictures">Has 3 pictures</label>
        // </div>`
        var htmlString="";
        htmlString += "<h3>Shop our latest handpicked collections</h3>";
        var self = this
        activeListings.forEach(function(listing) {
            htmlString += `<div class="listing">\
				<div data-item-id="${listing.Shop.shop_name}/${listing.listing_id}" class="image" style="background-image:url(${self.getImgSource(listing)})"></div>\
				<p data-item-id="${listing.Shop.shop_name}/${listing.listing_id}" class="title">${self.getTitle(listing)}</p>\
				<p>${self.getPrice(listing)}</p>
				</div>`
                
        })

        $('#listings-container').html(htmlString);



    }

    
})

var DetailsView = Backbone.View.extend({

	el:"#container",

	events: {
		"click #leftA": "getPrevItem",
		"click #left-arrow": "getPrevItem",
        "click #rightA": "getNextItem",
       	"click #right-arrow": "getNextItem",
        "click .image2":"getListingId"
	},

     getListingId: function(event) {
        var element = event.target;
        var itemId = element.getAttribute('data-item-id');
        location.hash = `details/${itemId}`
    },

    getListing:function(event){
        console.console.log(event);
    },

	getNextItem:function(event){
        event.stopPropagation();
		console.log("next")
        var item = this.model.attributes.results[0];
        var shopListings=this.collection.models[0].attributes.results
        var nextItemIndex=this.findNextListingIndex(item.listing_id,shopListings);
        console.log(nextItemIndex)
        console.log(shopListings[nextItemIndex].Shop.shop_name)
        console.log(shopListings[nextItemIndex].listing_id)
        location.hash=`details/${shopListings[nextItemIndex].Shop.shop_name}/${shopListings[nextItemIndex].listing_id}`;
        

	},

	getPrevItem:function(event){
        event.stopPropagation();
        var item = this.model.attributes.results[0];
        var shopListings=this.collection.models[0].attributes.results
        var prevItemIndex=this.findPrevListingIndex(item.listing_id,shopListings);
        console.log(prevItemIndex)
        console.log(shopListings[prevItemIndex].Shop.shop_name)
        console.log(shopListings[prevItemIndex].listing_id)
        location.hash=`details/${shopListings[prevItemIndex].Shop.shop_name}/${shopListings[prevItemIndex].listing_id}`;
        

	},



    getTitle: function(item) {
        return item.title;
    },

    getImage: function(item) {
        return item.MainImage.url_570xN;
    },

    getDescription: function(item) {
        return item.description;
    },

    getShopName:function(item){
    	return item.Shop.shop_name
    },

    getShopIcon:function(item){
    	return item.Shop.icon_url_fullxfull
    },

    buildSingleItem:function(item){
    	return `<div id="shop-icon">
        	<div style="background-image:url(${this.getShopIcon(item)})"></div>
        	<h4>${this.getShopName(item)}</h4>
        </div>

     	<div id="single-item">
			<h4>${this.getTitle(item)}</h4>
			<div id="item-img" style="background-image:url(${this.getImage(item)})">
			<div class="arrow" id="leftA"><div id="left-arrow"><</div></div>
			<div class="arrow" id="rightA"><div id="right-arrow">></div></div>
			</div>
			<p>${this.getDescription(item)}</p>
		</div>`
    },
     getImgSource: function(listing) {
        if (!listing['MainImage']) { // didnt solve the problem!
            return "https://vignette1.wikia.nocookie.net/thefakegees/images/8/86/Il_170x135.434854012_ipww.jpg"
        } else {
            return listing.MainImage.url_570xN
        }
    },
    getPrice: function(listing) {
        var symbols = {
            USD: "$",
            GBP: "£",
            EUR: "€",
            AUD: "AU$"
        }
        return symbols[listing.currency_code] + listing.price + " " + listing.currency_code
    },

    findNextListingIndex:function(listingId,itemsArr,){
        for(var i=0;i<itemsArr.length; i++){
            if(itemsArr[i].listing_id===listingId){
                console.log((i+1)%(itemsArr.length))
                return (i+1)%(itemsArr.length);
            }
        }
    },

    findPrevListingIndex:function(listingId,itemsArr,){
        for(var i=0;i<itemsArr.length; i++){
            if(itemsArr[i].listing_id===listingId){
                console.log((i+1)%(itemsArr.length))
                return (i-1)%(itemsArr.length);
            }
        }
    },



    render: function() {
        console.log(this.model.attributes.results[0]);
        var item = this.model.attributes.results[0];
        console.log('sss')
        console.log(this.collection.models[0].attributes.results)
		var self = this
        var shopListings=this.collection.models[0].attributes.results

        var htmlString = this.buildSingleItem(item)
	

		htmlString+=`<div id="shop-items">
			<div id="shop-icon2">
        	<div style="background-image:url(${this.getShopIcon(item)})"></div>
        	<h4>${this.getShopName(item)}</h4>
        </div>
		`


		
		shopListings.forEach(function(listing){
		
			htmlString += `<div class="listing2">\
				<div data-item-id="${listing.Shop.shop_name}/${listing.listing_id}" class="image2" style="background-image:url(${self.getImgSource(listing)})"></div>\
				<p class="title">${self.getTitle(listing)}</p>\
				<p>${self.getPrice(listing)}</p>
				</div>`
		})

		htmlString+=`</div>`



        $('#listings-container').html(htmlString);


    }

})


var Router = Backbone.Router.extend({

    routes: {
        'home': 'showHome',
        'details/:shop/:itemId': 'showDetails',
        'search/:query':'filteredSearch',
        '*default':'showDefault'
    },

    showDefault:function(){
        location.hash="home"
    },

    filteredSearch:function(query){
 
    		// if($('#lastWeek').is(':checked')) {this.filter.push(0)}
    		// if($('#onSale').is(':checked')) {this.filter.push(1)}
    		// if($('#Tpictures').is(':checked')) {this.filter.push(2)}


    	 var renderView = this.home.render.bind(this.home)
        this.etsy.fetch({
            dataType: 'jsonp',
            data: {
            	keywords:query,
                "api_key": this.etsy.apiKey,
                includes: 'Images,Shop'
            },
            processData: true
        }).success(renderView)

    },	

    showDetails: function(shop,itemId) {
    
        var self = this;
        this.details.model = new ItemModel();
        this.details.collection=new EtsyCollection();

        this.details.model.fetch({
            url: `https://openapi.etsy.com/v2/listings/${itemId}.js`,
            dataType: 'jsonp',
            data: {
                api_key: "v4scom4wfeznsgrvftmz39if",
                includes: 'MainImage,Shop'

            },
            processData: true
        }).success(function() {
            self.details.collection.fetch({
        	url:`https://openapi.etsy.com/v2/shops/${shop}/listings/active.js`,
        	dataType:'jsonp',
        	data: {
                "api_key": "v4scom4wfeznsgrvftmz39if",
                includes: 'MainImage,Shop'
            },
            processData: true

        }).success(self.details.render.bind(self.details))
        
})
},
    showHome: function() {
        var renderView = this.home.render.bind(this.home)
        this.etsy.fetch({
            dataType: 'jsonp',
            data: {
                "api_key": this.etsy.apiKey,
                includes: 'Images,Shop'
            },
            processData: true
        }).success(renderView)
    },


    initialize: function() {
        this.etsy = new EtsyCollection()
        this.home = new HomeView({
            collection: this.etsy
        })
        this.details = new DetailsView()
        Backbone.history.start();
    }

})

var router = new Router();

