// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global name,html,css,onEventAt,bindAttributes,bindAttributeToContent,bindAttributeToProperty */

"use strict";

name("mistral-text-field");
html("./mistral-text-field.html");
css("./mistral-text-field.css");

// specific to this componenet
bindAttributes("name","label","for");
bindAttributeToContent("label","label");
bindAttributeToContent("required",".required",(value)=>{
	return value || "required";
});
bindAttributeToContent("error",".error");
bindAttributeToProperty("value","input","value");

// inherited from INPUT[type=text]
bindAttributes("maxlength","input");
bindAttributes("minlength","input");
bindAttributes("pattern","input");
bindAttributes("placeholder","input");
bindAttributes("size","input");
bindAttributes("spellcheck","input");

// inherited from INPUT
bindAttributes("autocomplete","input");
bindAttributes("autofocus","input");
bindAttributes("disabled","input");
bindAttributes("form","input");
bindAttributes("list","input");
bindAttributes("name","input");
bindAttributes("readonly","input");
bindAttributes("required","input");
bindAttributes("tabindex","input");
bindAttributes("type","input");
bindAttributes("value","input");

onEventAt("input","keydown",(event,selected,element)=>{
	element.value = selected.value;
	element.setAttribute("value",selected.value);
});

onEventAt("input","keyup",(event,selected,element)=>{
	element.value = selected.value;
	element.setAttribute("value",selected.value);
});
