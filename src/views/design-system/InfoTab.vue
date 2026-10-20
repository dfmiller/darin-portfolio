<template>
  <div>
    <div class="intro">
      <h2>What is a Design System?</h2>
    </div>

    <p>A design system is a complete collection of reusable components, standards, guidelines, and documentation that product teams use to build and scale digital experiences consistently.</p>

    <p>They allow the default elements such as these:</p>

    <form class="plain ma-6">
      <div><label for="plain-input">Name:</label></div>
      <div><input id="plain-input" type="text" /></div>
      <div><label for="plain-description">Description:</label></div>
      <div><textarea id="plain-description"></textarea></div>
      <button type="button">Submit</button>
    </form>

    <p>...to be styled with consistancy across the platform.</p>

    <form class="styled ma-6">
      <v-text-field
        label="Name"
        prepend-inner-icon="mdi-account"
        variant="outlined"
      ></v-text-field>

      <v-textarea
        label="Description"
        prepend-inner-icon="mdi-comment"
        variant="outlined"
      ></v-textarea>

      <v-btn>Submit</v-btn>
    </form>
  </div>
</template>

<style scoped>
.intro h2 {
  margin-bottom: 6px;
  font-size: 1.5rem;
  font-weight: 600;
}

.plain {
  button, input, textarea {
    background: revert-layer;
    border: revert-layer;
    font: revert-layer;
    border-radius: revert-layer;
    padding: revert-layer;
    margin: revert-layer;
    box-sizing: revert-layer;
  }
}

form {
  padding: 16px;
  background-color: rgba(0,0,0,.15)
}
</style>
