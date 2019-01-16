// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global name,html,css,mapAttribute,mapAttributeToContent */

"use strict";

name("mistral-text-field");
html("./mistral-text-field.html");
css("./mistral-text-field.css");

// specific to this componenet
mapAttribute("name","label","for");
mapAttributeToContent("label","label");
mapAttributeToContent("required",".required",(value)=>{
	return value || "required";
});
mapAttributeToContent("error",".error");

// inherited from INPUT[type=text]
mapAttribute("maxlength","input");
mapAttribute("minlength","input");
mapAttribute("pattern","input");
mapAttribute("placeholder","input");
mapAttribute("size","input");
mapAttribute("spellcheck","input");

// inherited from INPUT
mapAttribute("autocomplete","input");
mapAttribute("autofocus","input");
mapAttribute("disabled","input");
mapAttribute("form","input");
mapAttribute("list","input");
mapAttribute("name","input");
mapAttribute("readonly","input");
mapAttribute("required","input");
mapAttribute("tabindex","input");
mapAttribute("type","input");
mapAttribute("value","input");
