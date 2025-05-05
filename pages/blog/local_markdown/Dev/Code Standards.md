---
title: Coding Standards for Class Member Ordering in C#
description: Learn the recommended ordering for class members in C# using StyleCop rules for cleaner, maintainable, and readable code.
keywords: C#, StyleCop, coding standards, class ordering, member organization
author: Derek Dreblow
version: 2025-05-22
categories:
  - Software Development
  - C#
tags:
  - C#
  - StyleCop
  - Code Style
  - Clean Code
  - Best Practices
---

# Coding Standards for Class Member Ordering in C#

Organizing class members in a consistent and predictable order improves **code readability, maintainability,** and reduces **merge conflicts**. According to [StyleCop's official rules](https://github.com/DotNetAnalyzers/StyleCopAnalyzers/blob/master/documentation/SA1201.md), here's the recommended ordering for elements inside a class, struct, or interface.

---

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