
// TODO: Basic Terminal Emulation - Done
// TODO: Fix UI Issues
// TODO: Add Command History
// TODO: Add Auto Complete 
// TODO: Crash Test this
// TODO: Test AJAX Stuff
// TODO: Refactor the code

/**
 * @Author :        superpulse.x@gmail.com
 * @file   :        wterm.jquery.js
 * @desc   :
 *
 * Allows Emulation of Terminal on the browser.
 * Completely Extendible. Command History.
 * Commandline Editing. Tabs Support. 
 * MOST Advanced Web Terminal
 *
 * */

( function( $ ) {


  var VERSION = '0.0.2';

  var get_defaults = function() {
    return {

      // Prompt Configuration
      PS1                : 'wterm $',
      PS2                : '>',

      // Style Configuration
      TERMINAL_CLASS     : '_wterm_terminal',
      PROMPT_CLASS       : '_wterm_prompt',
      THEME_CLASS_PREFIX : '_wterm_theme',
      DEFAULT_THEME      : '_green_on_black',
      HIGHLIGHT_CLASS    : '_wterm_highlight',
      KEYWORD_CLASS      : '_wterm_keyword',

      // Dimension Configuraion
      WIDTH              : '500px',
      HEIGHT             : '300px', 

      // Markup
      WELCOME_MESSAGE    : '<div>Welcome to Wterm version-' + VERSION + '. To begin type <span> help </span></div>',
      NOT_FOUND          : '<div> CMD: Command Not Found </div>',
      HELP               : 'Some Help Message',

      // Optional Settings
      AUTO_COMPLETE      : true,

    };
  };

 
  var dispatch = { 
    'help'   : function( tokens, element, content_class ) { return 'Help Text'; }, 
    'clear'  : function( tokens, element, content_class ) { element.find( '.' + content_class ).html( '' ); },
    'shiv'  : function( tokens, element, content_class ) { return '<br> He Must be a dog </br>'; },
  };


  $.fn.wterm = function( options ) {

    var settings = get_defaults();
    $.extend( true, settings, options );

    return this.each( function() {
      var element = $( this );
      
      // Setup Basic CSS, Add Classes, Truncate contents and add welcome message
      element.addClass( settings.TERMINAL_CLASS ).addClass( settings.THEME_CLASS_PREFIX + settings.DEFAULT_THEME );
      element.css( { width: settings.WIDTH, height: settings.HEIGHT } ).html( '' ).append( settings.WELCOME_MESSAGE );

      element.append( '<div class="' + settings.CONTENT_CLASS + '"></div>' );
      element.append( '<span class="' + settings.PROMPT_CLASS + '">' + settings.PS1 +
                      '<form> <input type="text" ></form></span>' ); 


      element.click( function() { element.find( 'span:last input' ).focus(); } );

      element.find( 'span:last form input' ).focus();

      element.find( 'span:last form' ).submit( function( e ) {
        e.preventDefault();
        e.stopPropagation();

        var input = $( this ).find( 'input' );
        var value = input.attr( 'value' );
        element.find( '.' + settings.CONTENT_CLASS ).append( '<span>' + settings.PS1 + " " +  value  + '</span><br>' );
        
        // Reset The Input
        input.attr( 'value', '' );

        var tokens = value.split( /\s+/ );

        var hide = function() {
          element.find( 'span:last' ).hide();
        };

        var show = function() {
          element.find( 'span:last' ).show();
          element.find( 'span:last form input' ).focus();
        };

        if( typeof dispatch[ tokens[0] ] === 'function' ) {
          hide();
          data = dispatch[ tokens[0] ]( tokens, element, settings.CONTENT_CLASS );
          element.find( '.' + settings.CONTENT_CLASS ).append( data );
          show();
        } else if( tokens[0] == '' ){
          // Do Nothing
          hide();
          show();
        } else {
          hide();
          element.find( '.' + settings.CONTENT_CLASS ).append( settings.NOT_FOUND.replace( 'CMD', tokens[0] ));
          show();
        }

      } );

      element.find( 'span:last form input' ).keydown( function( e ) {
        e.stopPropagation;
        if( e.shift ) {
          console.log( 'shift was pressed along' );
        }
      });

    });

  };


  $.register_command = function( command, dispatch_method ) {
    if( typeof dispatch_method === 'function' ) {
      dispatch[ command ] = dispatch_method;
    } else {
      throw 'Dispatch needs to be a method';
    }
  };

})( jQuery );
