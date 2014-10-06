angular-birthdatepicker
=======================

Angular directive for a datepicker with dropdowns.

The bootstrap datepicker sucks when you have to select a date from the long past (like a birthday). There is too much navigation and clicking involved.

A better solution is an old-school datepicker with 3 dropdowns (Year, Month, Day)

![alt text](http://i61.tinypic.com/24vnn8y.png)

Demo
-----

http://ready2run.ro/angular-birthdatepicker/demo/demo.html


Usage
-----

Include the "birthdatepicker.js" in your html.

Add 'angular-birthdatepicker' to your angular apps dependency list. 

<input type="text" birthdatepicker ng-model="birthday" />

Will clean up code soon. Inspired from Rory Madden's "angular-date-dropdowns" but created a minimal footprint and day item filtering based on selected month.

