
document.addEventListener("DOMContentLoaded", function () {

  // Get HTML elements
  const blogList = document.getElementById("homeBlogList");
  const emptyMessage = document.getElementById("homeEmpty");
  const searchInput = document.getElementById("blogSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortBlogs");
  const yearElement = document.getElementById("year");

  // Display current year
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Get blogs from Local Storage
  function getBlogs() {
    try {
      return JSON.parse(localStorage.getItem("blogs") || "[]");
    } catch (error) {
      return [];
    }
  }

  // Display blogs
  function displayBlogs() {

    if (!blogList) return;

    const blogs = getBlogs();

    const searchText = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    const selectedCategory = categoryFilter
      ? categoryFilter.value
      : "all";

    const sortValue = sortSelect
      ? sortSelect.value
      : "newest";

    // Search and category filter
    let filteredBlogs = blogs.filter(function (blog) {

      const title = String(blog.title || "").toLowerCase();
      const content = String(blog.content || "").toLowerCase();
      const category = String(blog.category || "Other");

      const matchesSearch =
        title.includes(searchText) ||
        content.includes(searchText) ||
        category.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "all" ||
        category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    // Sorting
    if (sortValue === "newest") {
      filteredBlogs.sort(function (a, b) {
        return new Date(b.createdAt || b.date || 0) -
               new Date(a.createdAt || a.date || 0);
      });
    }

    if (sortValue === "oldest") {
      filteredBlogs.sort(function (a, b) {
        return new Date(a.createdAt || a.date || 0) -
               new Date(b.createdAt || b.date || 0);
      });
    }

    if (sortValue === "title") {
      filteredBlogs.sort(function (a, b) {
        return String(a.title || "").localeCompare(
          String(b.title || "")
        );
      });
    }

    // Clear previous blogs
    blogList.innerHTML = "";

    // Show empty message
    if (emptyMessage) {
      emptyMessage.classList.toggle(
        "hidden",
        filteredBlogs.length > 0
      );

      const heading = emptyMessage.querySelector("h3");

      if (heading) {
        heading.textContent = blogs.length === 0
          ? "No blogs found yet"
          : "No matching blogs found";
      }
    }

    // Create blog cards
    filteredBlogs.forEach(function (blog) {

      const card = document.createElement("article");
      card.className = "blog-card";

      const title = document.createElement("h3");
      title.textContent = blog.title || "Untitled Blog";

      const category = document.createElement("p");
      category.textContent = "📂 " + (blog.category || "Other");

      const content = document.createElement("p");
      const fullContent = String(blog.content || "");

      content.textContent =
        fullContent.length > 180
          ? fullContent.substring(0, 180) + "..."
          : fullContent;

      const date = document.createElement("small");
      date.textContent = "📅 " + (blog.date || "Recently published");

      card.appendChild(title);
      card.appendChild(category);
      card.appendChild(content);
      card.appendChild(date);

      blogList.appendChild(card);
    });
  }

  // Search event
  if (searchInput) {
    searchInput.addEventListener("input", displayBlogs);
  }

  // Category filter event
  if (categoryFilter) {
    categoryFilter.addEventListener("change", displayBlogs);
  }

  // Sort event
  if (sortSelect) {
    sortSelect.addEventListener("change", displayBlogs);
  }

  // Display blogs when page loads
  displayBlogs();

});
