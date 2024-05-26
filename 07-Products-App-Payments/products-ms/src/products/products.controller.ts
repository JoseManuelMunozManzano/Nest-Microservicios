import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto, ProductTCP } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Para mantener el híbrido, podríamos dejar tanto el @Post como el @MessagePattern,
  // pero como en maint.ts no inicializamos la aplicación con create, como una app REST,
  // sino con createMicroservice, como un microservicio, tampoco tiene mucho sentido dejarlo.
  //
  // La información no va a venir en el body, porque NO HAY BODY, ya que no es una petición HTTP.
  // En un híbrido se podría dejar y podríamos recibir información por el body, pero este ejemplo
  // es puro microservicio.
  // Tanto @Body como @Param como @Query se sustituyen con @Payload. Ahí obtenemos la data.
  //
  // La parte del class-validator y los pipes es lo mismo, funciona exactamente igual.
  // @Post()
  @MessagePattern({ cmd: ProductTCP.CREATE })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: ProductTCP.FIND_ALL })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  // Usando @Payload así, esperamos: {id: 1}
  // @Get(':id')
  @MessagePattern({ cmd: ProductTCP.FIND_ONE })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: ProductTCP.UPDATE })
  update(
    // @Param('id', ParseIntPipe) id: number,
    // @Body() updateProductDto: UpdateProductDto,
    @Payload() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: ProductTCP.DELETE })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @MessagePattern({ cmd: ProductTCP.VALIDATE })
  validateProducts(@Payload() ids: number[]) {
    return this.productsService.validateProducts(ids);
  }
}
