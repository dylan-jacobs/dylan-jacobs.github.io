---
title: "Generative Adversarial Network (GAN) for abstract artwork generation"
modified: June 2022 - August 2022
excerpt: "Python machine-learning algorithm involving two algorithms-the generator and the discriminator-which I trained on abstract artwork to create original, computer-generated artwork.<br/><img src='/images/project_icons/gan1.png' width='500'>"
collection: portfolio
---
This python machine-learning script involves two 'competing' algorithms: the generator and the discriminator. The discriminator is trained on an image dataset with the goal of determining an 'authentic' image from a 'generated' image. The generator is an algorithm that produces images which are then fed into the discriminator to determine if the image is sufficiently realistic, subsequently adjusting its weights based on the discriminator's feedback. Eventually, the generator will reach steady-state, the point at which the generator is either no longer improving or the discriminator can no longer differentiate between the training set, or 'authentic,' images and the generator's 'generated' images. The generator can then be used to create realistic images that are similar to the training dataset images. I trained my model on approximately 16,000 abstract artwork images from online databases and achieved pretty good results for the relatively small dataset and lack of powerful computational servers (I used my laptop to train the model and because of my limited GPU was restricted to training on 64x64 pixel images). An interesting next step would be to gather larger datasets and to use a more powerful online server to create higher-definition images.

[Github Repository](https://github.com/dylan-jacobs/image-generating-GAN)

Samples of generated images:
------
<img src="https://github.com/dylan-jacobs/image-generating-GAN/assets/78403395/b7fb3533-3860-4994-8f06-809d6053ac0e" width="100">
<img src="https://github.com/dylan-jacobs/image-generating-GAN/assets/78403395/268e15e2-fc22-481e-a7c2-7e5b6d58e0b3" width="100">
<img src="https://github.com/dylan-jacobs/image-generating-GAN/assets/78403395/db6c3184-8590-4480-a958-b5e669230583" width="100">
<img src="https://github.com/dylan-jacobs/image-generating-GAN/assets/78403395/d4afad31-0072-4887-a16c-6f84e4ffeaf8" width="100">
<img src="https://github.com/dylan-jacobs/image-generating-GAN/assets/78403395/a3c5f237-a7d6-4096-b7cc-9471d37a8b39" width="100">
<img src="https://github.com/dylan-jacobs/image-generating-GAN/assets/78403395/570102a3-82ac-4a8d-9713-a8ca93db831a" width="100">
<img src="https://github.com/dylan-jacobs/image-generating-GAN/assets/78403395/207d328b-7528-41f7-87b8-17f296f485a4" width="100">
<img src="https://github.com/dylan-jacobs/image-generating-GAN/assets/78403395/4012836a-b53a-4583-9251-fea126f9cb22" width="100">