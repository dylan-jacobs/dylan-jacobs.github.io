function showMoreText(project) {
    var moreDots = document.querySelector(`.row .ftco-animate .project-description-blog-mb[data-project="${project}"] .col-lg-8 .more-dots`);
    var moreText = document.querySelector(`.row .ftco-animate .project-description-blog-mb[data-project="${project}"] .col-lg-8 .more-text`);
    var readMoreBtn = document.querySelector(`.row .ftco-animate .project-description-blog-mb[data-project="${project}"] .col-lg-8 .read-more-button`);

    if (moreDots.style.display === "none"){
      moreDots.style.display = "inline";
      readMoreBtn.innerHTML = "Read more";
      moreText.style.display = "none";
    } else{
      moreDots.style.display = "none";
      readMoreBtn.innerHTML = "Read less";
      moreText.style.display = "inline";
    }
}