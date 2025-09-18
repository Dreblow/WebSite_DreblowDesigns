---
title: Coding Standards Across Languages
description: A guide to coding standards for multiple languages including C#, Swift, and VB.NET, ensuring clean, maintainable, and consistent code.
keywords: C#, Swift, VB.NET, StyleCop, coding standards, class ordering, member organization, clean code
author: Derek Dreblow
version: 2025-09-18
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

# Coding Standards

Organizing code in a consistent and predictable way improves **code readability, maintainability,** and reduces **merge conflicts**. Follow these general best practices across all programming languages:

- Use clear and descriptive naming conventions for variables, methods, and classes.  
- Write meaningful comments to explain complex logic or important decisions.  
- Handle errors gracefully with appropriate error handling and logging.  
- Keep functions and methods focused on a single responsibility.  
- Maintain consistent indentation and formatting throughout the codebase.  

Adhering to these principles lays a solid foundation for writing clean, maintainable, and understandable code.

---

## Table of Contents

- [C# Coding Standards](#c-coding-standards)
- [Swift Coding Standards](#swift-coding-standards)
- [VB.NET Coding Standards](#vbnet-coding-standards)

---
---

# C# Coding Standards

Organizing class members in a consistent and predictable order improves **code readability, maintainability,** and reduces **merge conflicts**. According to [StyleCop's official rules](https://github.com/DotNetAnalyzers/StyleCopAnalyzers/blob/master/documentation/SA1201.md), here's the recommended ordering for elements inside a class, struct, or interface.

## Class design
* Use abstract when you need a contract + shared implementation.
* Use virtual only when overriding is optional.
* Keep override members together at the top of the class.
* Concrete implementations go below abstract/virtual overrides.

Within a class, struct, or interface, use this order:

1. `abstract`
2. `virtual`
3. concrete

## Top-Level Member Ordering (SA1201 & SA1203)

Within a class, struct, or interface, use this order:

1. Constant Fields  
2. Fields  
3. Constructors  
4. Finalizers (Destructors)  
5. Delegates  
6. Events  
7. Enums  
8. Interfaces (interface implementations)  
9. Properties  
10. Indexers  
11. Methods  
12. Structs  
13. Classes  

> This helps separate state, behavior, and nested types clearly.

---

## Access Modifier Ordering (SA1202)

Within each group above (e.g., methods or properties), order by access:

1. `public`  
2. `internal`  
3. `protected internal`  
4. `protected`  
5. `private`

---

## Static vs Instance (SA1204)

Inside each access level, place static members first:

- Static  
- Non-static

---

## Readonly vs Non-Readonly Fields (SA1214 & SA1215)

When declaring fields, order them as:

1. `readonly`  
2. `Non-readonly`

This rule helps you distinguish between immutable and mutable state.

---

## Unrolled Method Example

Here’s how the **methods** section would look when fully expanded:

1. `public static` methods  
2. `public` methods  
3. `internal static` methods  
4. `internal` methods  
5. `protected internal static` methods  
6. `protected internal` methods  
7. `protected static` methods  
8. `protected` methods  
9. `private static` methods  
10. `private` methods

---

## LINQ usage
* Use query syntax for readability in complex queries.
* Use method syntax (.Select, .Where) for short inline logic.
* Async/await
* Always use Async suffix in method names.
* Avoid async void except for event handlers.

---

## Async/await
* Always use Async suffix in method names.
* Avoid async void except for event handlers.

---

## Handling Exceptions to the Rule

Sometimes you’ll want to **group related members** (like interface implementations) together, even if it breaks the standard order.

**Best practice:** use **partial classes** to separate those concerns cleanly.

```csharp
// File: MyClass.cs
public partial class MyClass {
    // Primary structure and logic
}

// File: MyClass.Interfaces.cs
public partial class MyClass : IMyInterface {
    // Grouped interface methods
}
```

---

## Example Class Layout

```csharp
// Abstract base class demonstrating abstract and virtual members
public abstract class BaseClass
{
    // Abstract method (must be overridden in derived classes)
    public abstract void AbstractOperation();

    // Virtual method (can optionally be overridden)
    public virtual void VirtualOperation()
    {
        Console.WriteLine("BaseClass: Default virtual operation");
    }
}

// Concrete class inheriting from BaseClass and demonstrating overrides
public class SampleClass : BaseClass
{
    // 1. Constant Fields
    public const string APP_NAME = "MyApp";

    // 2. Fields
    private readonly int _id;
    private string _name;

    // 3. Constructor
    public SampleClass(int id, string name)
    {
        _id = id;
        _name = name;
    }

    // 9. Properties
    public int Id => _id;
    public string Name
    {
        get => _name;
        set => _name = value;
    }

    // 11. Methods

    // Override abstract method
    public override void AbstractOperation()
    {
        Console.WriteLine("SampleClass: Implementation of abstract operation");
    }

    // Optionally override virtual method
    public override void VirtualOperation()
    {
        Console.WriteLine("SampleClass: Overridden virtual operation");
    }

    // Public method
    public void DisplayInfo()
    {
        Console.WriteLine($"ID: {_id}, Name: {_name}");
    }

    // Protected method
    protected void ResetName()
    {
        _name = string.Empty;
    }

    // Private method
    private void LogChange(string oldName, string newName)
    {
        Console.WriteLine($"Name changed from {oldName} to {newName}");
    }
}
```

---
---

# Swift Coding Standards

Swift-specific coding standards and best practices will be added here to guide clean and maintainable Swift code development.

## Naming Conventions
- Use PascalCase for types (classes, structs, enums, protocols).
- Use camelCase for properties, variables, and functions.

## Optionals Handling
- Prefer `guard let` or `if let` to safely unwrap optionals.
- Avoid force unwrapping (`!`) unless absolutely sure the value is non-nil.

## File Organization Order
- Imports
- Typealiases
- Structs and Classes
- Extensions

### Example Swift Code

```swift
import Foundation

typealias CompletionHandler = (Bool) -> Void

struct User {
    let id: Int
    var name: String?

    func displayName() {
        guard let name = name else {
            print("Name is not set")
            return
        }
        print("User name: \(name)")
    }
}

extension User {
    func isValid() -> Bool {
        return name != nil && !name!.isEmpty
    }
}
```

---
---

# VB.NET Coding Standards

## Naming
* Keep PascalCase for methods, camelCase for locals.

---

## Class order
* Fields → Properties → Constructors → Methods → Events.

---

## Interop
* Keep all P/Invoke declarations in a dedicated module.