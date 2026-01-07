import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../models/users.model";
import { createAccessToken } from "../libs/jwt";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async register(
    data: Partial<User>
  ): Promise<{ user: User; token: string }> {
    const { name, last_name, email, password, is_admin } = data;

    // 1. Verificar si el correo existe
    const userFound = await this.userRepository.findByEmail(email!);

    if (userFound) {
      throw new Error("El email ya esta en uso.");
    }

		// 2. Encriptar la contraseña
		const passwordHash = await bcrypt.hash(password!, 10);

		// 3. Guardar el Usuario en la base de datos
		const newUser = await this.userRepository.create({
			name,
			last_name,
			email,
			password: passwordHash,
			is_admin,
		});

		// 4. Crear el Token de acceso
		const token = await createAccessToken({
			id: newUser.id,
			name: newUser.name,
			email: newUser.email,
			is_admin: newUser.is_admin,
		});

		return { user: newUser, token: token as string };
  }

	public async login(data: Partial<User>): Promise<{user: User, token: string}> {
		const { email, password } = data;

		// 1. Verificar si el correo existe en base de datos
		const userFound = await this.userRepository.findByEmail(email!);

		if (!userFound) {
			throw new Error ("El email ingresado no existe.");
		}

		// 2. Comparar las contraseñas
		const passwordMatch = await bcrypt.compare(password!, userFound.password);

		if (!passwordMatch) {
			throw new Error("La contraseña ingresada es incorrecta.");
		}

		// 4. Crear Token de acceso
		const token = await createAccessToken({
			id: userFound.id,
			name: userFound.name,
			email: userFound.email,
			is_admin: userFound.is_admin,
		});

		return { user: userFound, token: token as string };
	}

	public async getUser(id: string): Promise<User | null> {
		return await this.userRepository.findById(parseInt(id));
	}
}
