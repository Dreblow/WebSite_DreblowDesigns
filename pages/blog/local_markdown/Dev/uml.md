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

![UML Goodness picture](support/image4.png)

* `+` denotes public attributes or operations
* `-` denotes private attributes or operations
* `#` denotes protected attributes or operations

# Parameter Directionality
Each parameter in an operation (method) may be denoted as **in**, **out** or **inout** which specifies its direction with respect to the caller. This directionality is shown before the parameter name.

![UML Goodness picture](support/image5.png)

|  **Keyword**  | **Direction** | **What it Means** |
|:----------:   |:----------:   |----------         |
| `in`          | Input         | The method uses the value passed in, but doesn’t change it.|
| `out`         | Output        | The method doesn’t use the parameter as input, but sets it before returning.|
| `inout`       | Both          | The method uses the parameter and may modify it before returning|

### Example

Let’s say you have this in a UML diagram:

```csharp
+calculateDiscount(in price: Double, out discount: Double)
```

That tells us:
* The method needs a price as input.
* It computes a `discount`, which gets returned via the `discount` parameter.

If it were `inout discount: Double`, then:
*  The method could read and update the value of `discount`.

As oppose to:
```csharp
+calculateDiscount(in price: Double, in discount: Double) : int
```
* Both `price` and `discount` do not get changed, and the function returns a new `int` value. 

## Perspectives of Class Diagram
How you draw or interpret a class diagram depends on where you are in the development process.

At the very beginning, like when you’re building a domain model, you’re usually focused on the conceptual side, just identifying key ideas or real-world things your system needs to know about.

Once you’re deeper into the analysis phase, you might start blending conceptual and specification perspectives. This is where you not only define what things are, but also what kind of behavior or interfaces they expose.

As you shift into actual software design, your focus moves toward the implementation perspective, where you care about the specifics of how classes work under the hood, how data is stored, and how methods are built out.

### The Three Perspectives:
* **Conceptual** – High-level view of the domain. Focuses on real-world concepts, not code.
* **Specification** – Focuses on the software’s interfaces (like what methods a class exposes).
* **Implementation** – Gets into the actual class design, data structures, and logic.

The deeper you go, the more detail your diagram shows. But at the end of the day, the only thing you have to include is the class name, everything else depends on how much you want to communicate at that stage.

![UML Goodness picture](support/image6.png)

## Relationships between classes
A well-defined UML diagram can be directly mapped to actual code, making it easier to maintain the original design intent throughout implementation.

In this section, we’ll look at the different types of relationships that can exist between classes. If you’re not familiar with them yet, no worries. That’s exactly what this part is for.

Each class in your diagram can be connected to other classes through one or more relationships. These relationships represent how objects interact, depend on, or use each other — and they often translate directly into patterns in your programming language.

Here are the main types of class relationships you’ll see in UML:

![UML Goodness picture](support/image7.png)

## Inheritance (or Generalization):
Inheritance (or generalization) is all about creating a relationship where one class **builds on top of another**. It defines an **“is-a"** relationship meaning the child class *is a type of* the parent class.

Each subclass (or child class) **inherits** the properties and methods of its superclass (or parent class), but can also define its own specific behavior. So if you’ve got a Vehicle superclass, a Car subclass would inherit its core structure, but also add features like `openTrunk()` or `convertibleTop`.

In UML:
* The superclass is at the top, and subclasses branch from it.
* Abstract class names are shown in *italics*.
* The relationship is drawn as a **solid line** with a **hollow triangle arrowhead** pointing **upward to the parent class**.

So in the example below:
* `PowerController` and `Suspension` inherit from `Car`.
* That means they automatically have all of SuperClass’s attributes and methods (unless they override them).

![UML Goodness picture](support/image9.png)

## Association
An association in UML is a basic relationship between two classes. It shows that they’re connected in some way. You can think of it as a structural link between two objects that need to talk to each other or share data.

In diagrams, associations are drawn as a solid line between two classes. The line often has a verb or short phrase on it (like “manages” or “uses”) to describe what kind of relationship it is, ideally something that makes sense in the real-world domain you’re modeling.

A simple association is just a straight-up connection between two peer classes. One class may control or depend on the other, but they aren’t part of each other, they’re just related.

For example:
* `Class1` and `Class2` are connected.
* `Class1` might be a `<<control>> class` (like a controller or manager).
* `Class2` could be a `<<boundary>> class` (like a UI or API wrapper).
* The association is shown as a solid line with no arrow, just a clean link between the two.

This kind of relationship doesn’t imply ownership or hierarchy, it just means the two classes interact.

![UML Goodness picture](support/image10.png)

## Cardinality
Cardinality — also called **multiplicity** — defines **how many instances** of one class can be associated with another. It’s a key part of association lines in UML, and it answers questions like:
* Can one object be linked to just one other object?
* Can it be linked to many?
* Can many link to many?

### Common Cardinality Types
| **Type**  | **Notation**       | **What it Means** |
|---------- |--------------      |-------------------|
|One-to-One |1 to 1              |One instance of a class is connected to exactly one instance of another class.|
|One-to-Many|1 to 0..* or 1 to * |One instance connects to multiple instances of another class.|
|Many-to-Many|* to *             |Multiple instances of both classes can be connected to each other.|

### In Plain English
> * A one-to-one relationship might be:
> <Br>Each **User** has exactly one **Profile**
> <Br>(User 1 ----- 1 Profile)

> * A **one-to-many** relationship could be:
> <Br>One **Author** can write many **Books**
> <Br>(Author 1 ----- * Books)

> * A **many-to-many** relationship might be:
> <BR>Students enroll in many **Courses**, and each **Course** has many Students
> <Br>(Student * ----- * Course)

The graphic below summarizes the most common multiplicity options you’ll see on association lines.

![UML Goodness picture](support/image11.png)

> UML also supports custom cardinalities, like 3..5 or 0..10, if you want to define a more specific range.

## Aggregation


# Diverging from UML Class diagram
There are some items that are heavily used in development but don't show up in UMLs, such a enums (enumerations). Like any good tool, they are there to help us. This section, we free hand UML a bit to make it work for our needs.

## Enumerations

### UML Enum in Class Diagram Context

You can also show a class that uses the enum like this:

![UML Goodness picture](support/image8.png)

* This shows PowerController has an attribute state that uses the PowerState enum.
* The upward triangle ▲ is optional and can just represent dependency/use.

Since you’re building your own visual sheet, feel free to:
* Use a different background color (e.g. light yellow or green) for enums.
* Use italics or bold to style the enum values.
* Add a tiny icon or tag like E in the corner of the box if you want even faster visual scanning.