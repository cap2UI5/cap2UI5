" @keywords abap2js translation fixture
" @summary An abap2UI5 app in the ABAP the samples are written in, one construct of each kind abap2js translates.
"! The source of srv/apps/zcl_js_translated.js: abap2js.test.mjs holds the
"! module to what abap2js makes of this class, byte for byte, and drives it.
CLASS zcl_js_translated DEFINITION PUBLIC.

  PUBLIC SECTION.
    INTERFACES z2ui5_if_app.

    TYPES:
      BEGIN OF ty_s_row,
        title    TYPE string,
        count    TYPE i,
        selected TYPE abap_bool,
      END OF ty_s_row.
    DATA t_rows   TYPE STANDARD TABLE OF ty_s_row WITH EMPTY KEY.
    DATA s_order  TYPE ty_s_row.
    DATA name     TYPE string VALUE `World`.
    DATA active   TYPE abap_bool.
    DATA amount   TYPE p LENGTH 10 DECIMALS 2.
    DATA code     TYPE n LENGTH 6.
    DATA greeting TYPE string.

  PROTECTED SECTION.
    CONSTANTS:
      BEGIN OF cs_mode,
        edit    TYPE string VALUE `EDIT`,
        display TYPE string VALUE `DISPLAY`,
      END OF cs_mode.
    DATA client TYPE REF TO z2ui5_if_client.

    METHODS view_display.
    METHODS on_event.
    "! the label of a row count
    METHODS label
      IMPORTING
        count         TYPE i
      RETURNING
        VALUE(result) TYPE string.

  PRIVATE SECTION.
ENDCLASS.


CLASS zcl_js_translated IMPLEMENTATION.


  METHOD z2ui5_if_app~main.

    me->client = client.

    IF client->check_on_init( ).
      t_rows  = VALUE #(
          ( title = `first`  count = 1 selected = abap_true )
          ( title = `second` count = 2 ) ).
      s_order = VALUE #( title = `order` count = 3 ).
      view_display( ).
    ELSEIF client->check_on_navigated( ).
      view_display( ).
    ELSEIF client->check_on_event( ).
      on_event( ).
    ENDIF.

  ENDMETHOD.


  METHOD on_event.

    CASE client->get_event( ).
      WHEN `GREET` OR `HELLO`.
        DATA(selected) = 0.
        LOOP AT t_rows INTO DATA(row) WHERE selected = abap_true.
          selected = selected + 1.
        ENDLOOP.
        " abap_bool prints as ABAP prints it: X, or nothing
        greeting = |Hello { name }, active: { active }, { lines( t_rows ) } rows, { selected } selected|.
        client->message_box_display( greeting ).
      WHEN `TOGGLE`.
        active = xsdbool( active = abap_false ).
        client->follow_up_action( val   = client->cs_event-set_title
                                  t_arg = VALUE #( ( label( lines( t_rows ) ) ) ( CONV string( active ) ) ) ).
      WHEN `CALL`.
        client->nav_app_call( NEW zcl_js_hello( ) ).
      WHEN OTHERS.
        client->message_toast_display( SWITCH #( client->get_event( )
                                         WHEN cs_mode-edit THEN `edit mode`
                                         ELSE `unknown event` ) ).
    ENDCASE.

  ENDMETHOD.


  METHOD label.

    result = COND #( WHEN count = 1 THEN `one row` ELSE |{ count } rows| ).

  ENDMETHOD.


  METHOD view_display.

    DATA(view) = z2ui5_cl_ui5_view_builder=>factory(
        )->ele( n = `View` ns = `mvc`
            )->a( n = `xmlns`     v = `sap.m`
            )->a( n = `xmlns:mvc` v = `sap.ui.core.mvc` ).
    DATA(page) = view->ele( `Page`
        )->a( n = `title`          v = `abap2js - translated`
        )->a( n = `showNavButton`  b = client->check_app_prev_stack( )
        )->a( n = `navButtonPress` v = client->_event_nav_app_leave( ) ).

    page->tag( `Input`
        )->a( n = `value` v = client->_bind( name ) ).
    page->tag( `Input`
        )->a( n = `value` v = client->_bind( s_order-title ) ).
    page->tag( `Text`
        )->a( n = `text` v = |\{{ client->_bind( val = code path = abap_true ) }\}| ).
    page->ele( `List`
        )->a( n = `items` v = client->_bind( t_rows )
        )->tag( `StandardListItem`
            )->a( n = `title` v = `{TITLE}` ).
    page->tag( `Button`
        )->a( n = `text`  v = `Greet`
        )->a( n = `press` v = client->_event( `GREET` ) ).
    page->tag( `Button`
        )->a( n = `text`  v = `Edit`
        )->a( n = `press` v = client->_event( val = cs_mode-edit t_arg = VALUE #( ( `a` ) ( name ) ) ) ).

    client->view_display( view->stringify( ) ).

  ENDMETHOD.

ENDCLASS.
