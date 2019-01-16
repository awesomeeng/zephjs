// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global requires,name,html,css,mapAttribute */

"use strict";

requires("mistral-text-field");

name("mistral-password-field");
html("./mistral-password-field.html");
css("./mistral-password-field.css");

// inherited from mistral-text-field
mapAttribute("name","mistral-text-field");
mapAttribute("label","mistral-text-field");
mapAttribute("error","mistral-text-field");

// inherited from INPUT[type=text]
mapAttribute("maxlength","mistral-text-field");
mapAttribute("minlength","mistral-text-field");
mapAttribute("pattern","mistral-text-field");
mapAttribute("placeholder","mistral-text-field");
mapAttribute("size","mistral-text-field");
mapAttribute("spellcheck","mistral-text-field");

// inherited from INPUT
mapAttribute("autocomplete","mistral-text-field");
mapAttribute("autofocus","mistral-text-field");
mapAttribute("disabled","mistral-text-field");
mapAttribute("form","mistral-text-field");
mapAttribute("list","mistral-text-field");
mapAttribute("name","mistral-text-field");
mapAttribute("readonly","mistral-text-field");
mapAttribute("required","mistral-text-field");
mapAttribute("tabindex","mistral-text-field");
mapAttribute("type","mistral-text-field");
mapAttribute("value","mistral-text-field");
