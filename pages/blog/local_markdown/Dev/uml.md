---
title: UML - Unified Modeling Language
description: A guide to coding standards for multiple languages including C#, Swift, and VB.NET, ensuring clean, maintainable, and consistent code.
keywords: C#, Swift, VB.NET, StyleCop, coding standards, class ordering, member organization, clean code
author: Derek Dreblow
version: 2025-09-21
categories:
  - Software Development
  - C#
  - Swift
  - VB.NET
tags:
  - C#
  - Swift
  - VB.NET
  - StyleCop
  - Code Style
  - Clean Code
  - Best Practices
---

# UML - Unified Modeling Language

## What is a Class?
A class is like a set of blueprints. It defines the structure and behavior of something, but it isn’t the actual thing itself. In object-oriented programming, we use classes to create objects. The object is the thing that lives and operates in your program. It holds data and performs actions but it’s the class that defines what kind of object it is, and what it’s capable of doing.

You can think of a class as a design, and objects as real-world instances of that design. Every object built from the same class has the same components: properties (state) and methods (behavior). This relationship is at the heart of object-oriented design. It’s not really about the objects themselves, but about the structure (the class) that makes those objects possible.

## Example
Let’s take a car as an example. A class might define a generic ‘Car’ with a set of attributes and behaviors. When we create a specific car say, a blue electric compact car, that’s an object: a concrete instance of the Car class.

A car has properties which describe the car - size, color, Engine Type, Power as well as behaviors - TurnOn, Add Energy, and status. An object is an instance of a class.
![UML Goodness picture](support/image1.png)

## UML Class Notation
In UML, a class represents an idea or concept that bundles together both **data (attributes)** and **functionality (methods or operations)**. Each attribute has a specific data type (like `String`, `Int`, `Double`, etc.), and each method has a defined signature.  Meaning its name, parameters, and return type. The only thing that’s truly required is the class name, but adding attributes and methods gives the full picture.
![UML Goodness picture](support/image2.png)

### Class Name:
* The class name goes in the top section of the UML box.
* This is the only thing that’s required, it’s the identity of your class.

### Class Attributes:
* Attributes (also called properties or fields) are listed in the second section.
* Each attribute shows its name followed by a colon and its type (like color: String).
* These represent the member variables you’d see in code.

### Class Operations (Methods):
* Methods go in the third section. This is where the class shows what it can do.
* The return type of each method is listed after the colon at the end of the method.
* If a method takes parameters, their types are listed too (like setColor(color: String): void).
* These map directly to your class’s public functions or internal logic.
![UML Goodness picture](support/image3.png)

## Class Visibility
The +, - and # symbols before an attribute and operation name in a class denote the visibility of the attribute and operation.