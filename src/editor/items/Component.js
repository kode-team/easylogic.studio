import { Layer } from "./Layer";

// 속성 리스트 
// editor 리스트 
// selection 처리 
// selection 될지 말지를 니가 고르지 말고 
// 객체 스스로 기능을 정의 한다면 ? 

export class Component extends Layer {
    
    is (...itemType) {
        if (itemType.includes('component')) {
            return true; 
        }

        return super.is(...itemType)
    }

    getProps () {
        
        return [
            // {key: 'color', defaultValue: Length.px(0), editor: { ColorViewEditor } }
        ] 
    }
}