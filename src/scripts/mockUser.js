import { faker } from '@faker-js/faker';
import User from "../models/user.model.js";

const mockUser = new User({
    fname: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: "user",
    profilePicture: faker.image.avatar(),
    cars: [
        {
            carId: faker.string.uuid(),
            status: "active",
            batteryLevel: faker.number.int({ min: 0, max: 100 }),
            cameraFeed: faker.internet.url(),
            location: {
                latitude: faker.location.latitude(),
                longitude: faker.location.longitude(),
            },
            images: [
                {
                    imageId: faker.string.uuid(),
                    imageURL: faker.image.url(),
                    objectDetectionResults: {
                        objectName: faker.commerce.productName(),
                        confidence: faker.number.float({ min: 0, max: 1 }),
                    }
                }
            ]
        }
    ]
});

await mockUser.save();
console.log('Mock user created successfully!');
