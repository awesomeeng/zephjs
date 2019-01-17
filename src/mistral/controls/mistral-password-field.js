// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global requires,name,html,css,bindAttributes */

"use strict";

requires("mistral-text-field");

name("mistral-password-field");
html("./mistral-password-field.html");
css("./mistral-password-field.css");

// inherited from mistral-text-field
bindAttributes("name","mistral-text-field");
bindAttributes("label","mistral-text-field");
bindAttributes("error","mistral-text-field");

// inherited from INPUT[type=text]
bindAttributes("maxlength","mistral-text-field");
bindAttributes("minlength","mistral-text-field");
bindAttributes("pattern","mistral-text-field");
bindAttributes("placeholder","mistral-text-field");
bindAttributes("size","mistral-text-field");
bindAttributes("spellcheck","mistral-text-field");

// inherited from INPUT
bindAttributes("autocomplete","mistral-text-field");
bindAttributes("autofocus","mistral-text-field");
bindAttributes("disabled","mistral-text-field");
bindAttributes("form","mistral-text-field");
bindAttributes("list","mistral-text-field");
bindAttributes("name","mistral-text-field");
bindAttributes("readonly","mistral-text-field");
bindAttributes("required","mistral-text-field");
bindAttributes("tabindex","mistral-text-field");
bindAttributes("type","mistral-text-field");
bindAttributes("value","mistral-text-field");

onEventAt("mistral-text-field","change",(event,selected,element)=>{
	element.value = selected.value;
	element.dispatchEvent(new CustomEvent("change",{
		bubbles: false,
		detail: {
			value: selected.value
		}
	}));
});
