import faker from "faker";
import userModel from "../models/user.model.js";

export const createMockUser = async (req, res) => {
    try {
        const mockUser = new userModel({
            fname: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: "user",
            profilePicture: faker.image.avatar(),
            cars: [
                {
                    carId: faker.datatype.uuid(),
                    status: faker.random.arrayElement(["active", "inactive"]),
                    batteryLevel: faker.datatype.number({ min: 0, max: 100 }),
                    cameraFeed: faker.internet.url(),
                    location: {
                        latitude: faker.address.latitude(),
                        longitude: faker.address.longitude(),
                    },
                    images: [
                        {
                            imageId: faker.datatype.uuid(),
                            imageURL: faker.image.imageUrl(),
                            objectDetectionResults: {
                                objectName: faker.random.word(),
                                confidence: faker.datatype.float({ min: 0, max: 1 }),
                            }
                        }
                    ]
                }
            ]
        });

        const savedUser = await mockUser.save();
        res.status(201).json({ message: 'Mock user created', user: savedUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create mock user', error });
    }
};
