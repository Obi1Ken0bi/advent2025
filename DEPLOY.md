# Deployment Instructions

This project is set up to be easily deployed to GitHub Pages.

## Steps

1.  **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
    ```bash
    git add .
    git commit -m "Add visualization framework"
    git push
    ```

2.  **Enable GitHub Pages**:
    *   Go to your repository on GitHub.
    *   Click on **Settings**.
    *   Scroll down to the **Pages** section (or click "Pages" in the sidebar).
    *   Under **Source**, select **Deploy from a branch**.
    *   Under **Branch**, select `main` (or `master`) and set the folder to `/docs`.
    *   Click **Save**.

3.  **Visit your Site**:
    *   After a minute or so, GitHub will deploy your site.
    *   The link will be provided in the Pages settings section (usually `https://<username>.github.io/<repo-name>/`).

## Adding New Days

1.  Create a folder `docs/dayXX`.
2.  Copy the structure from `docs/day01` or create a new `index.html`.
3.  Link it in the main `docs/index.html` (currently auto-generated links assume `dayXX/index.html`).
