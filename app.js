$(document).ready(function(){

  // model to store user input
  // text and cache the index
  // of the updateReadView method loop
  var data = {
        model:[],
        currentIndex: null
  };
  

  
  // responds to user actions
  // sent from the view
  var controller = {
    
    setDataModel: function(){
      // making sure to scrub user
      // entry for malicious characters
      function validate(string) {
        var reg = RegExp(/[<>{}()]/g); 
        if(reg.test(string)){ // remove any malicious characters
          string = string.replace(/[<>{}()]/g,"");
        } // end if
        return string;
      }

      // validate input prior
      // to importing into APP
      var str = validate($('#textarea').val());
      var arr = str.split(' ');
      
      // update the model with user
      // input and clear text area input field
      data.model = arr;
      $('#textarea').val('Text successfully loaded!');

      // update the max value of
      // JQUERY slider controls
      $( "#slider" ).slider( "option", "max", data.model.length );
      $( "#slider" ).slider( "enable" );

    },

    getDataModel: function(){
      this.data = data.model;
      return this.data;
    },

    updateReadView: function(i){
      // set function scope variables
      var dataArr = this.getDataModel();
      var output = $("#output");
      var speed = $('#speed').val();
      i === data.currentIndex ? i = data.currentIndex : i = 0;
      // set view.property access for
      // timer. This gives clearInterval
      // lexical access to timer var
      // as well as speedControls object
      // which also utilize clearInterval
      this.timer = setInterval(function() {   
      // use setInterval() to call
      // anonFunction that updates
      // view text for the number of
      // words stored in the data model
      // array
      var length = dataArr.length;
      if (i < (length +1)) {
      output.text(dataArr[i]);
      } else {
          clearInterval(controller.timer);
      }
      // cache the current index
      // in the data model
      // for use throughout the
      // application
      data.currentIndex = i;
      // change slider positions to
      // correspond with model array index
      $( "#slider" ).slider( "value", i );

      i++;
          }, speed);
    },

    // helper functions for user actions
    // specifically, the speed reader
    // button controls
    speedControls:{
      pause: function(){
        clearInterval(controller.timer);
      },
      play: function(){
        clearInterval(controller.timer);
        var index;
        data.currentIndex > data.model.length ? index = 0 : index = data.currentIndex ;
        controller.updateReadView(index);
      },
      reset: function(){
       clearInterval(controller.timer);
       data.currentIndex = 0;
       $('#output').text(data.model[0]);

      }
    },

    // initialize event list listeners
    // for DOM elements 
    init: function(){
      view.initViews();
    }
      
  };



  var view = {
    initViews: function(){
        // make view.property references
        // to button elements to be 
        // used across the view methods
        this.txtBtn = $('#load-text');
        this.rdrBtn = $('#play-text'); 
        this.pause = $('#pause');
        this.play = $('#play');
        this.reset = $('#reset');
        
        // set event listeners for user actions
        // that will trigger methods on the
        // controller object
        this.txtBtn.on('click',function(e) {
            e.preventDefault();
            controller.setDataModel();
        });

        this.rdrBtn.on('click',function(e){
            e.preventDefault();
            view.renderReadView();  
        });

        this.pause.on('click',function(e){
            e.preventDefault();
            controller.speedControls.pause();  
        });

        this.play.on('click',function(e){
            e.preventDefault();
            controller.speedControls.play();  
        });

        this.reset.on('click',function(e){
            e.preventDefault();
            controller.speedControls.reset();  
        });

        
        // begin JQUERY slider functions 
        // initialize the slider obj
        $( "#slider" ).slider({
          slide: function( event, ui ) {},
          min: 0
        });

        // disable slider till user submits
        // text input data to update the model
        // and create listeners for user actions
        $( "#slider" ).slider( "disable" );
         
        $( "#slider" ).on( "slide", function( event, ui ) {
              data.currentIndex = ui.value;
             $('#output').text(data.model[ui.value]);
        });

        $('#reset').on('click',function(){
            $( "#slider" ).slider( "value", 0 );
            // alert(JSON.stringify($( "#slider" ).slider('option')));
        });
        
    },
    // update the view
    renderReadView: function(){
        controller.updateReadView();
    }
  }; // end view

  // start the application
  // this sets event handlers
  // for DOM elements
  controller.init();

}); // end document.ready