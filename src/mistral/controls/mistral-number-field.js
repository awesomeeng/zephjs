// (c) 2018, The Awesome Engineering Company, https://awesomeneg.com

/* global name,html,css,onCreate,onEventAt,bindAttributes,bindAttributeToContent,bindAttributeToProperty */

"use strict";

name("mistral-number-field");
html("./mistral-number-field.html");
css("./mistral-number-field.css");

// specific to this componenet
bindAttributes("name","label","for");
bindAttributeToContent("label","label");
bindAttributeToContent("required",".required",(value)=>{
	return value || "required";
});
bindAttributeToContent("error",".error");
bindAttributeToProperty("value","input","value");
bindAttributes("disabled","mistral-button");

// inherited from INPUT[type=text]
bindAttributes("min","input");
bindAttributes("max","input");
bindAttributes("placeholder","input");
bindAttributes("step","input");

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

onCreate((element)=>{
	let value = element.value || null;
	let min = parseFloat(element.getAttribute("min") || null) || null;
	let max = parseFloat(element.getAttribute("max") || null) || null;

	if (value===null && min!==null && max!==null) value = ((max-min)/2)+min;
	else if (value===null && min!==null) value = min;
	else if (value===null && max!==null) value = max;
	else value = 0;

	element.setAttribute("value",value);
	element.value = value;
});

onEventAt("input","keydown",(event,selected,element)=>{
	element.value = selected.value;
	element.setAttribute("value",selected.value);
});

onEventAt("input","keyup",(event,selected,element)=>{
	element.value = selected.value;
	element.setAttribute("value",selected.value);
});

onEventAt("mistral-button.decrement","click",(event,selected,element)=>{
	let min = parseFloat(element.getAttribute("min") || null) || null;
	let max = parseFloat(element.getAttribute("max") || null) || null;
	let step = parseFloat(element.getAttribute("step") || null) || 1;
	let value = element.value || min || max || 0;

	value -= step;
	if (min!==null && value<min) value = min;

	element.setAttribute("value",value);
	element.value = value;
});

onEventAt("mistral-button.increment","click",(event,selected,element)=>{
	let min = parseFloat(element.getAttribute("min") || null) || null;
	let max = parseFloat(element.getAttribute("max") || null) || null;
	let step = parseFloat(element.getAttribute("step") || null) || 1;
	let value = element.value || max || min || 0;

	value += step;
	if (max!==null && value>max) value = max;

	element.setAttribute("value",value);
	element.value = value;
});
